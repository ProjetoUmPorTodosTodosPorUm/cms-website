import { Role } from './enums';
import type { AgendaDto, AnnouncementDto, ReportDto, TestimonialDto, UserDto } from './types';

export const widthBreakPointXS = 576;
export const widthBreakPointMD = 768;
export const widthBreakPointLG = 992;
export const widthBreakPointXL = 1200;

export const TEST_FILES_PATH = './tests/test_files/';

export const MESSAGES = {
  YUP: {
    EMAIL: 'Email deve ser um email válido',
    CONFIRM_PASSWORD: 'As senhas devem ser iguais',
    TOKEN_MATCH: 'Apenas dígitos alfanuméricos são válidos'
  },
  CONTACT: {
    SUCCESS: 'Mensagem enviada! Aguarde o retorno'
  },
  LOG: {
    CLEAN: 'Deseja remover todas as entradas do log?'
  },
  AUTH: {
    TOKEN_INVALID: 'Token inválido!'
  }
}

export const TEMPLATES = {
  YUP: {
    REQUIRED: (field: string) => `${field} é um campo obrigatório.`,
    ONE_OF: (enums: string[]) => `Você deve escoher um dentre os valores: ${enums.join(', ')}.`,
    MIN: (field: string, length: number) => `${field} deve ter no mínimo ${length} caracteres.`,
    MAX: (field: string, length: number) => `${field} deve ter no máximo ${length} caracteres.`,
    MIN_NUMBER: (field: string, value: number) => `${field} deve ser no mínimo ${value}.`,
    MAX_NUMBER: (field: string, value: number) => `${field} deve ser no máximo ${value}.`,
  },
  REMOVE: {
    USER: (email: string) => `Você deseja remover a conta de ${email}?`,
    FILE: (name: string) => `Você deseja remover o arquivo ${name}?`,
    LOG: (createdAt: Date) => `Você deseja remover o log de ${createdAt}?`,
    AGENDA: (title: string) => `Você deseja remover o evento ${title}?`,
    TESTIMONIAL: (name: string) => `Você deseja remover o testemunho de ${name}?`,
    REPORT: (title: string) => `Você deseja remover o relatório ${title}?`
  }
}

export const USER_TEMPLATE = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: Role.VOLUNTEER,
  avatar: null,
  lastAccess: null
} as UserDto;

export const AGENDA_TEMPLATE = {
  id: '',
  title: '',
  message: '',
  date: new Date().toISOString().split('T')[0],
  attachments: [''],
  field: null,
} as AgendaDto;

export const ANNOUNCEMENT_TEMPLATE = {
  id: '',
  title: '',
  message: '',
  fixed: false,
  attachments: [''],
  field: null,
} as AnnouncementDto;

export const TESTIMONIAL_TEMPLATE = {
  id: '',
  name: '',
  email: '',
  text: '',
  field: null
} as TestimonialDto;

export const REPORT_TEMPLATE = {
  id: '',
  title: '',
  text: '',
  shortDescription: '',
  attachments: [''],
  month: null,
  year: 0,
  field: null,
} as ReportDto;