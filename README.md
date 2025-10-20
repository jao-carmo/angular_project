# Angular Supabase Dashboard

Dashboard de gerenciamento de produtos com Angular 17, Supabase e sistema de autenticação completo.

## Tecnologias

Angular 17 • Angular Material • Supabase • TypeScript

## Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

Acesse: `http://localhost:4200`

## Configuração

### 1. Banco de Dados

Na pasta database estão os comandos SQL para rodar no Supabase.

### 2. Autenticação

Configure no Supabase Dashboard:

1. Acesse Authentication > Settings
2. Desabilite "Enable Email Confirmations" (para desenvolvimento)
3. Configure Site URL: `http://localhost:4200`
4. Adicione Redirect URLs: `http://localhost:4200/**`

### 3. Criar Usuário de Teste

Authentication > Users > Add user > Create new user
- Email: seu@gmail.com
- Password: senha123
- Auto Confirm User: Habilitado

## Sistema de Autenticação

### Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de login |
| `/register` | Público | Criar nova conta |
| `/` | Protegido | Dashboard (Home) |
| `/products` | Protegido | Gestão de produtos |

### Funcionalidades de Auth

- Login com email e senha
- Registro de novos usuários
- Validação de formulários
- Proteção de rotas com AuthGuard
- Persistência de sessão
- Logout funcional
- Exibição de usuário logado

### Validações de Registro

- Email no formato válido
- Senha mínima de 6 caracteres
- Confirmação de senha
- Email com domínio real (Gmail, Outlook, etc)
- Detecção de emails duplicados

### Observação Importante

Use emails reais para registro (ex: usuario@gmail.com). O Supabase valida domínios de email.

## Funcionalidades

### Autenticação
- Sistema completo de login/registro
- Guards protegendo rotas privadas
- Validação de formulários
- Sessão persistente

### Produtos
- CRUD completo de produtos
- Upload de imagens via URL
- Preview em tempo real
- Interface Material Design
- Confirmação antes de excluir

### Interface
- Página inicial moderna
- Navegação entre páginas
- Design responsivo
- Feedback visual

## Estrutura do Projeto

```
src/app/
├── auth/
│   ├── login/           # Componente de login
│   └── register/        # Componente de registro
├── guards/
│   └── auth.guard.ts    # Guard de autenticação
├── home/                # Página inicial
├── products/            # CRUD de produtos
├── services/
│   └── supabase.service.ts  # Integração Supabase + Auth
└── app.routes.ts        # Configuração de rotas
```

## Resolução de Problemas

### Erro: "Email address is invalid"
Use emails com domínios reais (Gmail, Outlook, Yahoo). O Supabase valida a existência do domínio.

### Erro: "Este email já está cadastrado"
O email já existe no sistema. Use outro email ou faça login.

### Não consegue fazer login
Verifique se:
- Usuário foi criado no Supabase
- Email foi confirmado (ou confirmação está desabilitada)
- Credenciais estão corretas

### Produtos não aparecem
Execute as políticas RLS no SQL Editor para permitir acesso aos usuários autenticados.
