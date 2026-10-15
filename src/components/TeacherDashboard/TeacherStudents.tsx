import React, { useState } from 'react';
import { User, Essay, StudentStats } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  FileText, 
  CheckCircle, 
  CheckCircle2,
  TrendingUp, 
  X, 
  AlertCircle,
  Eye,
  ShieldAlert,
  Edit2,
  Trash2,
  Clock,
  Check,
  CreditCard,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

interface EnrichedStudent extends User {
  essaysSubmitted: number;
  essaysCorrected: number;
  averageGrade: number;
  bestGrade: number;
}

interface TeacherStudentsProps {
  students: EnrichedStudent[];
  onRefresh: () => Promise<void>;
  onOpenEssayDetails: (essayId: string) => void;
}

export const TeacherStudents: React.FC<TeacherStudentsProps> = ({
  students,
  onRefresh,
  onOpenEssayDetails
}) => {
  const [search, setSearch] = useState('');
  
  // Registration modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    targetExam: ''
  });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Selected student for detailed profile modal
  const [selectedStudent, setSelectedStudent] = useState<EnrichedStudent | null>(null);
  const [studentProfileLoading, setStudentProfileLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState<{
    essays: Essay[];
    stats: StudentStats;
  } | null>(null);

  // Edit Student Modal state (Full CRUD Update)
  const [editingStudent, setEditingStudent] = useState<EnrichedStudent | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    targetExam: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'pendente_aprovacao'
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Delete Student Modal state (Full CRUD Delete)
  const [deletingStudent, setDeletingStudent] = useState<EnrichedStudent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Filter: 'all' | 'pending' | 'active'
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const pendingStudentsList = students.filter(s => s.status === 'pendente_aprovacao');

  const filteredStudents = students.filter(s => {
    if (activeFilter === 'pending') {
      if (s.status !== 'pendente_aprovacao') return false;
    } else if (activeFilter === 'active') {
      if (s.status !== 'ativo') return false;
    }

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.cpf && s.cpf.includes(q)) ||
      (s.targetExam && s.targetExam.toLowerCase().includes(q))
    );
  });

  const handleApprove = async (studentId: string, studentName: string) => {
    try {
      await api.approveStudent(studentId);
      await onRefresh();
      setActionSuccessMessage(`✅ Cadastro aprovado! Acesso de ${studentName} foi liberado com sucesso.`);
      setTimeout(() => setActionSuccessMessage(''), 4500);
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar aluno.');
    }
  };

  const handleReject = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Deseja realmente recusar o cadastro de ${studentName}?`)) return;
    try {
      await api.rejectStudent(studentId);
      await onRefresh();
      setActionSuccessMessage(`Cadastro de ${studentName} foi recusado.`);
      setTimeout(() => setActionSuccessMessage(''), 4500);
    } catch (err: any) {
      alert(err.message || 'Erro ao recusar aluno.');
    }
  };

  const handleTogglePayment = async (studentId: string) => {
    try {
      await api.togglePayment(studentId);
      await onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status de pagamento.');
    }
  };

  const handleOpenStudentProfile = async (student: EnrichedStudent) => {
    setSelectedStudent(student);
    setStudentProfileLoading(true);
    try {
      const data = await api.getStudentProfile(student.id);
      setStudentDetails({
        essays: data.essays,
        stats: data.stats
      });
    } catch (err) {
      console.error(err);
    } finally {
      setStudentProfileLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.password) {
      setRegisterError('Nome, e-mail e senha são campos obrigatórios.');
      return;
    }

    setRegistering(true);
    setRegisterError('');

    try {
      await api.createStudent(newStudent);
      await onRefresh();
      setShowAddModal(false);
      setNewStudent({
        name: '',
        email: '',
        password: '',
        cpf: '',
        phone: '',
        targetExam: ''
      });
    } catch (err: any) {
      setRegisterError(err.message || 'Falha ao cadastrar aluno.');
    } finally {
      setRegistering(false);
    }
  };

  const handleToggleStatus = async (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.toggleStudentStatus(studentId);
      await onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditStudent = (student: EnrichedStudent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      email: student.email,
      password: '',
      cpf: student.cpf || '',
      phone: student.phone || '',
      targetExam: student.targetExam || '',
      status: student.status
    });
    setUpdateError('');
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      setUpdateError('Nome e e-mail são campos obrigatórios.');
      return;
    }

    setUpdating(true);
    setUpdateError('');
    try {
      const updates: any = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim(),
        cpf: editFormData.cpf.trim(),
        phone: editFormData.phone.trim(),
        targetExam: editFormData.targetExam.trim(),
        status: editFormData.status
      };
      if (editFormData.password.trim()) {
        updates.password = editFormData.password.trim();
      }
      await api.updateStudent(editingStudent.id, updates);
      await onRefresh();
      setEditingStudent(null);
    } catch (err: any) {
      setUpdateError(err.message || 'Falha ao atualizar dados do aluno.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.deleteStudent(deletingStudent.id);
      await onRefresh();
      setDeletingStudent(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Falha ao excluir aluno.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Success Toast */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage('')}
            className="text-emerald-600 hover:text-emerald-800 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              Controle de Acessos & Pagamentos
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestão de Alunos & Validações
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Validação de novos cadastros, confirmação de pagamentos e monitoramento de desempenho.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>Cadastrar Novo Aluno</span>
        </button>
      </div>

      {/* Pending Registrations Alert Banner */}
      {pendingStudentsList.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-white border border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {pendingStudentsList.length} {pendingStudentsList.length === 1 ? 'Novo cadastro aguardando' : 'Novos cadastros aguardando'} aprovação pedagógica
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Estes alunos se cadastraram e só terão acesso às funcionalidades após a sua aprovação de cadastro.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Ver Cadastros Pendentes ({pendingStudentsList.length})
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Subtabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os Alunos ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span>Aguardando Aprovação</span>
            {pendingStudentsList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingStudentsList.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ativos & Pagos ({students.filter(s => s.status === 'ativo' && s.paymentConfirmed).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail, concurso..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Mobile & Tablet Card View (Responsive CRUD List for Celular e Tablet) */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 shadow-xs">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm">Nenhum aluno encontrado.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isActive = student.status === 'ativo';
            return (
              <div 
                key={student.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 hover:border-amber-300 transition-colors"
              >
                {/* Header: Nome, Concurso, Status & Pagamento */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {student.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">
                      {student.targetExam || 'Concursos Gerais'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {student.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                      isActive 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {isActive ? 'Ativo' : 'Inativo'}
                    </span>
                    {student.paymentConfirmed ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Pago
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-0.5 animate-pulse">
                        <Clock className="w-2.5 h-2.5" /> Pagamento Pendente
                      </span>
                    )}
                  </div>
                </div>

                {/* If Pending Approval Banner inside Card */}
                {student.status === 'pendente_aprovacao' && (
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Aguardando Aprovação Pedagógica
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(student.id, student.name)}
                        className="flex-1 py-1.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar Cadastro e Liberar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(student.id, student.name)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        title="Recusar cadastro"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                )}

                {/* Info: CPF / Contato */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  <div>CPF: {student.cpf || 'Não inf.'}</div>
                  <div>Tel: {student.phone || 'Não inf.'}</div>
                  <div>Cadastro: {new Date(student.createdAt).toLocaleDateString('pt-BR')}</div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Redações</span>
                    <span className="text-xs font-bold text-slate-900">
                      {student.essaysSubmitted} <span className="text-slate-400 font-normal">/</span> <span className="text-emerald-700">{student.essaysCorrected}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Média</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {student.averageGrade > 0 ? student.averageGrade.toFixed(1) : '—'}
                    </span>
                  </div>
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Melhor</span>
                    <span className="text-xs font-bold text-amber-800 font-mono">
                      {student.bestGrade > 0 ? student.bestGrade.toFixed(1) : '—'}
                    </span>
                  </div>
                </div>

                {/* Actions Grid: Ver Perfil, Editar, Status, Excluir */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenStudentProfile(student)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Perfil</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEditStudent(student, e)}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(student.id, e)}
                    className={`flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      isActive 
                        ? 'border-slate-300 text-slate-600 hover:bg-slate-100' 
                        : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{isActive ? 'Desativar' : 'Ativar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingStudent(student);
                      setDeleteError('');
                    }}
                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Students Table (Hidden on mobile/tablet) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Aluno & Concurso</th>
                <th className="py-3.5 px-5">CPF / Contato</th>
                <th className="py-3.5 px-4 text-center">Aprovação</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Cadastro</th>
                <th className="py-3.5 px-4 text-center">Redações</th>
                <th className="py-3.5 px-4 text-center">Média</th>
                <th className="py-3.5 px-4 text-center">Melhor Nota</th>
                <th className="py-3.5 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-sm">Nenhum aluno encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isActive = student.status === 'ativo';
                  return (
                    <tr
                      key={student.id}
                      onClick={() => handleOpenStudentProfile(student)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Nome e Concurso */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-amber-800 font-medium">
                          {student.targetExam || 'Concursos Gerais'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {student.email}
                        </div>
                      </td>

                      {/* CPF e Contato */}
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-700">
                        <div>CPF: {student.cpf || 'Não informado'}</div>
                        <div className="text-slate-500 mt-0.5">{student.phone || 'Sem telefone'}</div>
                      </td>

                      {/* Aprovação */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {student.status === 'ativo' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Aprovado
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                              Pendente
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApprove(student.id, student.name)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer"
                              title="Aprovar aluno e liberar acesso imediatamente"
                            >
                              Aprovar Acesso
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          isActive
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      {/* Data de Cadastro */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                        {new Date(student.createdAt).toLocaleDateString('pt-BR')}
                      </td>

                      {/* Indicadores: Enviadas / Corrigidas */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-700 tabular-nums whitespace-nowrap">
                        <span className="font-bold text-slate-900">{student.essaysSubmitted}</span>
                        <span className="text-slate-400"> / </span>
                        <span className="text-emerald-600 font-bold">{student.essaysCorrected} corr.</span>
                      </td>

                      {/* Média */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-xs tabular-nums whitespace-nowrap">
                        {student.averageGrade > 0 ? (
                          <span className="text-slate-800">{student.averageGrade.toFixed(1)}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Melhor Nota */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-xs tabular-nums whitespace-nowrap">
                        {student.bestGrade > 0 ? (
                          <span className="text-amber-800 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                            {student.bestGrade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenStudentProfile(student);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors cursor-pointer"
                            title="Ver histórico e notas do aluno"
                          >
                            Ver Perfil
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleOpenEditStudent(student, e)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
                            title="Editar dados cadastrais do aluno"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleStatus(student.id, e)}
                            className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                              isActive 
                                ? 'border-slate-300 text-slate-600 hover:text-rose-700 hover:bg-rose-50' 
                                : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={isActive ? 'Desativar acesso' : 'Ativar acesso'}
                          >
                            {isActive ? 'Desativar' : 'Ativar'}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingStudent(student);
                              setDeleteError('');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Excluir cadastro do aluno"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastrar Novo Aluno Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full my-6 p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" />
                Cadastrar Novo Aluno
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {registerError && (
              <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Ex: João Ferreira da Silva"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    E-mail (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="aluno@email.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Senha de Acesso *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    placeholder="Ex: aluno123"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={newStudent.cpf}
                    onChange={(e) => setNewStudent({ ...newStudent, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Celular / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Concurso Alvo (Foco de Estudo)
                </label>
                <input
                  type="text"
                  value={newStudent.targetExam}
                  onChange={(e) => setNewStudent({ ...newStudent, targetExam: e.target.value })}
                  placeholder="Ex: Polícia Rodoviária Federal, EsPCEx, Oficial PMESP..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {registering ? 'Criando Acesso...' : 'Criar Acesso do Aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editar Aluno Modal (CRUD Update) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full my-6 p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-600" />
                Editar Dados do Aluno
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {updateError && (
              <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{updateError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    E-mail (Login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Nova Senha (opcional)
                  </label>
                  <input
                    type="text"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    placeholder="Em branco para manter atual"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={editFormData.cpf}
                    onChange={(e) => setEditFormData({ ...editFormData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Celular / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Concurso Alvo
                  </label>
                  <input
                    type="text"
                    value={editFormData.targetExam}
                    onChange={(e) => setEditFormData({ ...editFormData, targetExam: e.target.value })}
                    placeholder="Ex: PRF, PF, PMESP..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Status da Conta
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="ativo">Ativo (Acesso Liberado)</option>
                    <option value="inativo">Inativo (Acesso Bloqueado)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  {updating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excluir Aluno Modal (CRUD Delete) */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Excluir Aluno Cadastrado
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tem certeza que deseja excluir o cadastro de <strong className="text-slate-900">{deletingStudent.name}</strong>?
                </p>
                <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-100 leading-relaxed">
                  Atenção: Essa ação excluirá permanentemente o acesso do aluno e todas as suas redações enviadas.
                </p>

                {deleteError && (
                  <div className="mt-3 p-2 rounded bg-red-50 text-xs text-red-700 border border-red-200">
                    {deleteError}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setDeletingStudent(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDeleteStudent}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {deleting ? 'Excluindo...' : 'Sim, Excluir Aluno'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Perfil do Aluno Modal (Section 7: Perfil do aluno, Histórico de redações, Desempenho) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full my-6 overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Ficha Tática do Aluno
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className={`text-[11px] font-semibold ${
                    selectedStudent.status === 'ativo' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {selectedStudent.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedStudent.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Dados Cadastrais */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Dados Cadastrais
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">E-mail:</span>
                    <span className="text-slate-900 font-semibold">{selectedStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CPF:</span>
                    <span className="text-slate-800 font-mono">{selectedStudent.cpf || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Celular:</span>
                    <span className="text-slate-800 font-mono">{selectedStudent.phone || 'Não informado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Concurso Alvo:</span>
                    <span className="text-amber-800 font-semibold">{selectedStudent.targetExam || 'Não especificado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Data de Cadastro:</span>
                    <span className="text-slate-700 font-mono">{new Date(selectedStudent.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Indicadores de Desempenho */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-medium text-slate-500 block">Redações Enviadas</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                    {selectedStudent.essaysSubmitted}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-medium text-slate-500 block">Redações Corrigidas</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                    {selectedStudent.essaysCorrected}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-medium text-slate-500 block">Média Geral</span>
                  <span className="text-xl font-bold font-mono text-amber-700 mt-1 block">
                    {selectedStudent.averageGrade > 0 ? selectedStudent.averageGrade.toFixed(1) : '—'}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-medium text-slate-500 block">Melhor Nota</span>
                  <span className="text-xl font-bold font-mono text-amber-600 mt-1 block">
                    {selectedStudent.bestGrade > 0 ? selectedStudent.bestGrade.toFixed(1) : '—'}
                  </span>
                </div>
              </div>

              {/* Histórico de Redações */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                  Histórico de Redações do Aluno
                </h4>
                {studentProfileLoading ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Carregando histórico...</p>
                ) : studentDetails?.essays && studentDetails.essays.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Tema / Título</th>
                          <th className="py-2.5 px-4">Data</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4 text-right">Nota</th>
                          <th className="py-2.5 px-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentDetails.essays.map(essay => (
                          <tr key={essay.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 max-w-xs truncate text-slate-900 font-medium">
                              {essay.title || essay.theme}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                              {new Date(essay.submittedAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className={`text-[11px] font-semibold ${
                                essay.status === 'Pendente' ? 'text-amber-700' : 'text-emerald-700'
                              }`}>
                                {essay.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-bold text-amber-800">
                              {essay.correction?.grade !== undefined ? essay.correction.grade.toFixed(1) : '—'}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudent(null);
                                  onOpenEssayDetails(essay.id);
                                }}
                                className="px-2 py-1 text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                              >
                                Abrir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-3">Este aluno ainda não enviou redações.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
