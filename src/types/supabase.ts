// ==============================================================================
// Supabase Database Definitions for Português Tático (TypeScript Types)
// Etapa 1: Estrutura de Dados e Autenticação Inicial
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string | null;
          role: 'professor' | 'aluno';
          cpf: string | null;
          phone: string | null;
          target_exam: string | null;
          status: 'ativo' | 'inativo' | 'pendente_aprovacao';
          payment_confirmed: boolean;
          must_change_password: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          password_hash?: string | null;
          role?: 'professor' | 'aluno';
          cpf?: string | null;
          phone?: string | null;
          target_exam?: string | null;
          status?: 'ativo' | 'inativo' | 'pendente_aprovacao';
          payment_confirmed?: boolean;
          must_change_password?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string | null;
          role?: 'professor' | 'aluno';
          cpf?: string | null;
          phone?: string | null;
          target_exam?: string | null;
          status?: 'ativo' | 'inativo' | 'pendente_aprovacao';
          payment_confirmed?: boolean;
          must_change_password?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          title: string;
          theme: string;
          instructions: string;
          deadline: string | null;
          status: 'rascunho' | 'ativa' | 'arquivada';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          theme: string;
          instructions: string;
          deadline?: string | null;
          status?: 'rascunho' | 'ativa' | 'arquivada';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          theme?: string;
          instructions?: string;
          deadline?: string | null;
          status?: 'rascunho' | 'ativa' | 'arquivada';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      proposal_criteria: {
        Row: {
          id: string;
          proposal_id: string;
          name: string;
          description: string | null;
          max_points: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          name: string;
          description?: string | null;
          max_points: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          name?: string;
          description?: string | null;
          max_points?: number;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      essays: {
        Row: {
          id: string;
          proposal_id: string | null;
          student_id: string;
          student_name: string;
          title: string;
          theme: string;
          exam_target: string | null;
          text_content: string;
          submitted_at: string;
          status: string;
          original_file: Json;
          correction: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id?: string | null;
          student_id: string;
          student_name: string;
          title: string;
          theme: string;
          exam_target?: string | null;
          text_content?: string;
          submitted_at?: string;
          status?: string;
          original_file?: Json;
          correction?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string | null;
          student_id?: string;
          student_name?: string;
          title?: string;
          theme?: string;
          exam_target?: string | null;
          text_content?: string;
          submitted_at?: string;
          status?: string;
          original_file?: Json;
          correction?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      corrections: {
        Row: {
          id: string;
          essay_id: string;
          teacher_id: string;
          general_feedback: string | null;
          strengths: string | null;
          improvements: string | null;
          final_grade: number | null;
          status: 'rascunho' | 'finalizada';
          corrected_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          essay_id: string;
          teacher_id: string;
          general_feedback?: string | null;
          strengths?: string | null;
          improvements?: string | null;
          final_grade?: number | null;
          status?: 'rascunho' | 'finalizada';
          corrected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          essay_id?: string;
          teacher_id?: string;
          general_feedback?: string | null;
          strengths?: string | null;
          improvements?: string | null;
          final_grade?: number | null;
          status?: 'rascunho' | 'finalizada';
          corrected_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      correction_criteria_scores: {
        Row: {
          id: string;
          correction_id: string;
          criterion_id: string;
          score: number;
          comments: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          correction_id: string;
          criterion_id: string;
          score: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          correction_id?: string;
          criterion_id?: string;
          score?: number;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      correction_versions: {
        Row: {
          id: string;
          essay_id: string;
          correction_id: string;
          teacher_id: string;
          version_number: number;
          general_feedback: string | null;
          strengths: string | null;
          improvements: string | null;
          final_grade: number;
          criteria_snapshot: Json;
          archived_at: string;
        };
        Insert: {
          id?: string;
          essay_id: string;
          correction_id: string;
          teacher_id: string;
          version_number: number;
          general_feedback?: string | null;
          strengths?: string | null;
          improvements?: string | null;
          final_grade: number;
          criteria_snapshot: Json;
          archived_at?: string;
        };
        Update: {
          id?: string;
          essay_id?: string;
          correction_id?: string;
          teacher_id?: string;
          version_number?: number;
          general_feedback?: string | null;
          strengths?: string | null;
          improvements?: string | null;
          final_grade?: number;
          criteria_snapshot?: Json;
          archived_at?: string;
        };
      };
      exam_boards: {
        Row: {
          id: string;
          name: string;
          category: 'civil' | 'militar';
          slug: string;
          characteristics: string;
          scoring_criteria: Json;
          recommended_structure: string;
          tactical_tips: Json;
          sample_theme: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: 'civil' | 'militar';
          slug: string;
          characteristics: string;
          scoring_criteria?: Json;
          recommended_structure: string;
          tactical_tips?: Json;
          sample_theme?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'civil' | 'militar';
          slug?: string;
          characteristics?: string;
          scoring_criteria?: Json;
          recommended_structure?: string;
          tactical_tips?: Json;
          sample_theme?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      text_guides: {
        Row: {
          id: string;
          title: string;
          summary: string;
          key_points: Json;
          practical_example: string;
          checklist: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          summary: string;
          key_points?: Json;
          practical_example: string;
          checklist?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          key_points?: Json;
          practical_example?: string;
          checklist?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      tactical_method: {
        Row: {
          id: string;
          number: number;
          title: string;
          subtitle: string;
          objective: string;
          execution_steps: Json;
          model_template: string;
          golden_rule: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          number: number;
          title: string;
          subtitle: string;
          objective: string;
          execution_steps?: Json;
          model_template: string;
          golden_rule: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          title?: string;
          subtitle?: string;
          objective?: string;
          execution_steps?: Json;
          model_template?: string;
          golden_rule?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      weekly_missions: {
        Row: {
          id: string;
          title: string;
          objective: string;
          target_subject: string;
          tasks: Json;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          objective: string;
          target_subject: string;
          tasks?: Json;
          start_date?: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          objective?: string;
          target_subject?: string;
          tasks?: Json;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_stats: {
        Row: {
          student_id: string;
          essays_submitted: number;
          essays_corrected: number;
          average_grade: number;
          highest_grade: number;
          lowest_grade: number;
          latest_grade: number | null;
          grade_history: Json;
          questions_answered: number;
          questions_correct: number;
          accuracy_rate: number;
          subject_breakdown: Json;
          critical_weaknesses: Json;
          frequent_attention_points: Json;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          essays_submitted?: number;
          essays_corrected?: number;
          average_grade?: number;
          highest_grade?: number;
          lowest_grade?: number;
          latest_grade?: number | null;
          grade_history?: Json;
          questions_answered?: number;
          questions_correct?: number;
          accuracy_rate?: number;
          subject_breakdown?: Json;
          critical_weaknesses?: Json;
          frequent_attention_points?: Json;
          updated_at?: string;
        };
        Update: {
          student_id?: string;
          essays_submitted?: number;
          essays_corrected?: number;
          average_grade?: number;
          highest_grade?: number;
          lowest_grade?: number;
          latest_grade?: number | null;
          grade_history?: Json;
          questions_answered?: number;
          questions_correct?: number;
          accuracy_rate?: number;
          subject_breakdown?: Json;
          critical_weaknesses?: Json;
          frequent_attention_points?: Json;
          updated_at?: string;
        };
      };
    };
  };
}
