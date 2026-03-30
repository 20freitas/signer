-- ==========================================
-- SIGNER SAAS - SUPABASE SCHEMA E POLÍTICAS
-- ==========================================

-- 1. TABELA PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  studio_name TEXT,
  logo_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'freelancer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS para public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilizadores podem ver o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Utilizadores podem editar o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar Profile ao registar novo User no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. TABELA CLIENTS
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers vêm os seus clientes" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Freelancers criam os seus clientes" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Freelancers editam os seus clientes" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Freelancers apagam os seus clientes" ON public.clients FOR DELETE USING (auth.uid() = user_id);


-- 3. TABELA PROJECTS
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'in_progress',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers vêm os seus projetos" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Freelancers criam os seus projetos" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Freelancers editam os seus projetos" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Freelancers apagam os seus projetos" ON public.projects FOR DELETE USING (auth.uid() = user_id);


-- 4. TABELA MESSAGES (Bate-papo do Projeto)
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- Simplificando RLS: se o freelancer é dono do projeto, ele vê e manda mensagens
CREATE POLICY "Freelancers gerem mensagens dos seus projetos" ON public.messages 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = messages.project_id AND p.user_id = auth.uid())
  );


-- 5. TABELA FILES (Documentos do Projeto)
CREATE TABLE public.files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers gerem os ficheiros dos seus projetos" ON public.files 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = files.project_id AND p.user_id = auth.uid())
  );


-- ==========================================
-- 6. SETUP STORAGE (BUCKETS)
-- ==========================================

-- Bucket para os Ficheiros dos Projetos
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);
-- Bucket para Branding / Logos
INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true);

-- Storage Políticas (Acesso total para donos logados - versão simplificada)
CREATE POLICY "Permitir upload ficheiros" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files' OR bucket_id = 'branding');
CREATE POLICY "Permitir leitura ficheiros" ON storage.objects FOR SELECT TO public USING (bucket_id = 'project-files' OR bucket_id = 'branding');
CREATE POLICY "Permitir apagar ficheiros" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-files' OR bucket_id = 'branding');
