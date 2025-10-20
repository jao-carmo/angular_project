-- Script para configurar autenticação no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- =====================================================
-- OPÇÃO 1: CRIAR USUÁRIO MANUALMENTE (Dashboard)
-- =====================================================
-- 1. Acesse: Authentication > Users
-- 2. Clique em "Add user" > "Create new user"
-- 3. Digite email e senha
-- 4. ✅ Marque "Auto Confirm User" para testes
-- 5. Clique em "Create user"

-- Exemplo de usuário para testes:
-- Email: admin@teste.com
-- Senha: senha123456

-- =====================================================
-- OPÇÃO 2: PERMITIR REGISTRO PÚBLICO (Recomendado)
-- =====================================================
-- Com a tela de registro implementada, os usuários podem
-- criar suas próprias contas em: http://localhost:4200/register

-- Para habilitar registro público sem confirmação de email (TESTES APENAS):
-- 1. Vá em: Authentication > Settings > Email Auth
-- 2. Desabilite: "Enable email confirmations"
-- 3. Os usuários poderão fazer login imediatamente após registro

-- Para produção, mantenha confirmação de email habilitada e configure SMTP

-- =====================================================
-- CONFIGURAR POLÍTICAS RLS (Row Level Security)
-- =====================================================
-- IMPORTANTE: Execute as queries abaixo para permitir que
-- usuários autenticados acessem e gerenciem produtos

-- Verificar políticas RLS existentes na tabela products:
SELECT * FROM pg_policies WHERE tablename = 'products';

-- Se necessário, criar políticas básicas para permitir CRUD aos usuários autenticados:
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (permitir leitura para usuários autenticados)
CREATE POLICY "Usuários autenticados podem visualizar produtos"
ON products FOR SELECT
TO authenticated
USING (true);

-- Política para INSERT (permitir criação para usuários autenticados)
CREATE POLICY "Usuários autenticados podem criar produtos"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para UPDATE (permitir atualização para usuários autenticados)
CREATE POLICY "Usuários autenticados podem atualizar produtos"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para DELETE (permitir exclusão para usuários autenticados)
CREATE POLICY "Usuários autenticados podem deletar produtos"
ON products FOR DELETE
TO authenticated
USING (true);
