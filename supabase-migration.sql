-- MG Inventory Database Schema
-- Migration v1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')) DEFAULT 'user',
  seller_reference TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  base_unit TEXT NOT NULL CHECK (base_unit IN ('piece', 'meter', 'sachet', 'kilo', 'unit')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('piece', 'meter', 'sachet', 'kilo', 'unit')),
  conversion_ratio NUMERIC,
  purchase_price NUMERIC NOT NULL CHECK (purchase_price >= 0),
  manager_sale_price NUMERIC NOT NULL CHECK (manager_sale_price >= 0),
  stock_quantity NUMERIC DEFAULT 0 CHECK (stock_quantity >= 0),
  stock_alert_threshold NUMERIC DEFAULT 10 CHECK (stock_alert_threshold >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('quote', 'invoice', 'delivery')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending_validation', 'validated', 'delivered', 'cancelled')) DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES public.users(id),
  validated_by UUID REFERENCES public.users(id),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  invoice_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC DEFAULT 0 CHECK (discount_amount >= 0),
  delivery_fee NUMERIC DEFAULT 0 CHECK (delivery_fee >= 0),
  tax_amount NUMERIC DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  margin_amount NUMERIC NOT NULL,
  margin_percentage NUMERIC NOT NULL,
  notes TEXT,
  internal_notes TEXT,
  seller_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  validated_at TIMESTAMPTZ
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit_type TEXT NOT NULL,
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  discount_percentage NUMERIC DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount NUMERIC DEFAULT 0 CHECK (discount_amount >= 0),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  notes TEXT
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  activity_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON public.invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Managers can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Products policies (all users can read)
CREATE POLICY "Everyone can view active products" ON public.products
  FOR SELECT USING (is_active = TRUE OR EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('manager', 'admin')
  ));

CREATE POLICY "Managers can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Product variants policies
CREATE POLICY "Everyone can view product variants" ON public.product_variants
  FOR SELECT USING (TRUE);

CREATE POLICY "Managers can manage variants" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Clients policies
CREATE POLICY "Everyone can view clients" ON public.clients
  FOR SELECT USING (TRUE);

CREATE POLICY "Managers can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Invoices policies
CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Managers can view all invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Users can create invoices" ON public.invoices
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their draft invoices" ON public.invoices
  FOR UPDATE USING (created_by = auth.uid() AND status = 'draft');

CREATE POLICY "Managers can update any invoice" ON public.invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Invoice items policies
CREATE POLICY "Users can view items of their invoices" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE id = invoice_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Managers can view all invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Users can manage items of their invoices" ON public.invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE id = invoice_id AND created_by = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Activity logs policies
CREATE POLICY "Users can view their own logs" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Managers can view all logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(invoice_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year TEXT;
  count INTEGER;
  invoice_num TEXT;
BEGIN
  -- Determine prefix
  prefix := CASE
    WHEN invoice_type = 'quote' THEN 'DEV'
    WHEN invoice_type = 'delivery' THEN 'BL'
    ELSE 'FAC'
  END;
  
  -- Get current year
  year := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Count existing invoices of this type this year
  SELECT COUNT(*) INTO count
  FROM public.invoices
  WHERE invoice_number LIKE prefix || '-' || year || '-%';
  
  -- Generate number
  invoice_num := prefix || '-' || year || '-' || LPAD((count + 1)::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
