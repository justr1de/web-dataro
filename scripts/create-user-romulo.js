// Script para criar usuário Rômulo Azevedo no Supabase
// Execute com: node scripts/create-user-romulo.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csuzmlajnhfauxqgczmu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdXptbGFqbmhmYXV4cWdjem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzExMzcsImV4cCI6MjA4MTMwNzEzN30.eATRbvz2klesZnV3iGBk6sgrvZMbk_1YscW5oi9etfA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createUser() {
  try {
    console.log('Criando usuário Rômulo Azevedo...');
    
    // Inserir usuário na tabela usuarios
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nome: 'Rômulo Azevedo',
          email: 'romuloazevedo.ro@gmail.com',
          senha_hash: '123456', // Senha padrão (em produção, use bcrypt)
          ativo: true,
          tipo: 'usuario', // Usuário comum
          requer_troca_senha: true, // Flag para forçar troca de senha
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log('Dados:', data);
    console.log('\nCredenciais:');
    console.log('Email: romuloazevedo.ro@gmail.com');
    console.log('Senha: 123456');
    console.log('\n⚠️  O usuário será solicitado a trocar a senha no primeiro login.');
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

createUser();
