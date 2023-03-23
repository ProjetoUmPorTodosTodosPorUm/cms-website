import { Role } from './enums';
import type { UserDto } from './types';

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
    MIN: (field: string, length: number) => `${field} deve ter no mínimo ${length} caracteres.`
  },
  REMOVE: {
    USER: (email: string) => `Você deseja remover a conta de ${email}?`,
    FILE: (name: string) => `Você deseja remover o arquivo ${name}?`,
    LOG: (createdAt: Date) => `Você deseja remover o log de ${createdAt}?`,
    MEDIA: (name: string) => `Você deseja remover a mídia ${name}?`,
    WORK: (name: string) => `Você deseja remover o trabalho ${name}?`
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
