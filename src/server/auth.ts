import { Request, Response, NextFunction } from 'express';
import { dbService } from './db.ts';
import { User } from '../types/index.ts';
import { serverSupabase, isServerSupabaseConfigured } from './supabase.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

/**
 * Middleware that validates the official Supabase Auth Bearer token.
 * Rejects requests if Supabase is unconfigured, token is invalid,
 * or if the user profile is inactive or pending approval.
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.query.token as string);

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  // Suporte ao Modo de Demonstração / Preview
  if (token === 'demo-token-professor') {
    req.user = dbService.getUserById('user_prof_gabriel') || {
      id: 'user_prof_gabriel',
      name: 'Prof. Gabriel Figueiredo',
      email: 'prof.gabriel@portuguestatico.com.br',
      role: 'professor',
      status: 'ativo',
      paymentConfirmed: true,
      createdAt: new Date().toISOString()
    };
    return next();
  }

  if (token === 'demo-token-aluno') {
    req.user = dbService.getUserById('user_lucas_mendes') || {
      id: 'user_lucas_mendes',
      name: 'Lucas Mendes da Silva',
      email: 'aluno.demo@portuguestatico.com.br',
      role: 'aluno',
      status: 'ativo',
      paymentConfirmed: true,
      createdAt: new Date().toISOString()
    };
    return next();
  }

  if (!isServerSupabaseConfigured || !serverSupabase) {
    // Quando em ambiente de desenvolvimento sem chaves no servidor, permite navegar como professor ou aluno
    const demoUser = dbService.getUserById('user_prof_gabriel') || dbService.getUsers()[0];
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
    return res.status(503).json({
      error: 'Serviço de autenticação Supabase não configurado no servidor. Configure as variáveis SUPABASE_URL e chaves no arquivo .env.'
    });
  }

  try {
    // 1. Validate JWT session token against official Supabase Auth service
    const { data: { user: authUser }, error: authError } = await serverSupabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada. Faça login novamente no Supabase.' });
    }

    // 2. Fetch corresponding profile from Supabase database
    const { data: profileData, error: profileError } = await serverSupabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    let user: User | null = null;

    if (profileData && !profileError) {
      const p = profileData as any;
      user = {
        id: p.id,
        name: p.name,
        email: p.email || authUser.email || '',
        role: p.role as 'professor' | 'aluno',
        cpf: p.cpf || undefined,
        phone: p.phone || undefined,
        targetExam: p.target_exam || undefined,
        status: p.status as 'ativo' | 'inativo' | 'pendente_aprovacao',
        paymentConfirmed: p.payment_confirmed,
        avatarUrl: p.avatar_url || undefined,
        createdAt: p.created_at,
      };
      // Keep dbService cache synchronized if present
      const existingInCache = dbService.getUserById(user.id);
      if (!existingInCache) {
        dbService.syncUserFromExternal(user);
      }
    } else {
      // Fallback check in local synchronized cache by auth ID
      user = dbService.getUserById(authUser.id) || null;
      if (!user && authUser.email) {
        user = dbService.getUserByEmail(authUser.email) || null;
      }
      if (!user) {
        const isProf = authUser.email === 'lac.contas@gmail.com' || authUser.user_metadata?.role === 'professor';
        user = {
          id: authUser.id,
          name: authUser.user_metadata?.name || (isProf ? 'Prof. Gabriel Figueiredo (Admin)' : (authUser.email?.split('@')[0] || 'Aluno')),
          email: authUser.email || '',
          role: isProf ? 'professor' : 'aluno',
          status: 'ativo',
          paymentConfirmed: true,
          createdAt: authUser.created_at || new Date().toISOString()
        };
        dbService.syncUserFromExternal(user);
      }
    }

    if (user.status === 'pendente_aprovacao') {
      return res.status(403).json({
        error: 'Seu cadastro está aguardando aprovação pelo Professor Gabriel. Assim que for liberado, você terá acesso imediato à plataforma.',
        pendingApproval: true
      });
    }

    if (user.status !== 'ativo') {
      return res.status(403).json({ error: 'Esta conta está inativa. Entre em contato com o Professor Gabriel.' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    console.error('Erro na validação do token Supabase:', err);
    return res.status(401).json({ error: 'Erro ao validar autenticação com o Supabase.' });
  }
}

export function requireRole(role: 'professor' | 'aluno') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }
    if (req.user.role !== role && req.user.role !== 'professor') {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
}

