-- إنشاء جداول قاعدة البيانات المترابطة
-- نظام إدارة المبيعات والأصناف

-- 1. جدول الفئات
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(50) DEFAULT 'blue',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    stock INTEGER DEFAULT 0,
    image TEXT,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    supplier VARCHAR(255),
    cost_price DECIMAL(10,2),
    min_stock_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    company VARCHAR(255),
    tax_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول المبيعات
CREATE TABLE IF NOT EXISTS sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    total DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    final_total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'transfer')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. جدول تفاصيل المبيعات
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. جدول الفواتير
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. جدول المدفوعات
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'transfer')),
    payment_date DATE NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. جدول المخزون
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    type VARCHAR(20) CHECK (type IN ('in', 'out', 'adjustment')),
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_invoices_sale_id ON invoices(sale_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);

-- إنشاء دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء triggers لتحديث updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لتحديث المخزون عند البيع
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- تحديث المخزون عند إضافة عنصر للبيع
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    -- إضافة سجل في جدول المخزون
    INSERT INTO inventory (product_id, quantity, type, reference, notes)
    VALUES (NEW.product_id, NEW.quantity, 'out', 'Sale: ' || NEW.sale_id, 'بيع');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث المخزون
CREATE TRIGGER update_stock_on_sale_trigger 
    AFTER INSERT ON sale_items
    FOR EACH ROW EXECUTE FUNCTION update_stock_on_sale();

-- إنشاء دالة لحساب إجمالي المبيعات
CREATE OR REPLACE FUNCTION calculate_sale_total()
RETURNS TRIGGER AS $$
BEGIN
    -- حساب إجمالي المبيعات من تفاصيل البيع
    UPDATE sales 
    SET total = (
        SELECT COALESCE(SUM(total), 0) 
        FROM sale_items 
        WHERE sale_id = NEW.sale_id
    ),
    final_total = (
        SELECT COALESCE(SUM(total), 0) 
        FROM sale_items 
        WHERE sale_id = NEW.sale_id
    ) - COALESCE(sales.discount, 0),
    updated_at = NOW()
    WHERE id = NEW.sale_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لحساب إجمالي المبيعات
CREATE TRIGGER calculate_sale_total_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON sale_items
    FOR EACH ROW EXECUTE FUNCTION calculate_sale_total();

-- إنشاء دالة لتحديث حالة الفاتورة
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
DECLARE
    total_paid DECIMAL(10,2);
    invoice_total DECIMAL(10,2);
BEGIN
    -- حساب إجمالي المدفوعات
    SELECT COALESCE(SUM(amount), 0) INTO total_paid
    FROM payments 
    WHERE invoice_id = NEW.invoice_id;
    
    -- الحصول على إجمالي الفاتورة
    SELECT total INTO invoice_total
    FROM invoices 
    WHERE id = NEW.invoice_id;
    
    -- تحديث حالة الفاتورة
    IF total_paid >= invoice_total THEN
        UPDATE invoices 
        SET status = 'paid', updated_at = NOW()
        WHERE id = NEW.invoice_id;
    ELSIF total_paid > 0 THEN
        UPDATE invoices 
        SET status = 'pending', updated_at = NOW()
        WHERE id = NEW.invoice_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث حالة الفاتورة
CREATE TRIGGER update_invoice_status_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_invoice_status();

-- إدخال بيانات تجريبية للفئات
INSERT INTO categories (name, description, color) VALUES
('مواسير', 'جميع أنواع المواسير والأنابيب', 'blue'),
('صمامات', 'صمامات المياه والغاز', 'green'),
('محابس', 'محابس المياه المختلفة', 'purple'),
('أدوات', 'أدوات البناء واللحام', 'orange'),
('عوازل', 'مواد العزل الحراري', 'red'),
('كهربائيات', 'المواد الكهربائية', 'yellow'),
('بناء', 'مواد البناء الأساسية', 'indigo'),
('حديد', 'حديد التسليح والبناء', 'teal'),
('أبواب ونوافذ', 'الأبواب والنوافذ', 'pink'),
('دهانات', 'الدهانات والطلاء', 'gray'),
('بلاط', 'البلاط والسيراميك', 'cyan');

-- إدخال بيانات تجريبية للعملاء
INSERT INTO customers (name, email, phone, address, company) VALUES
('أحمد محمد', 'ahmed@example.com', '+218912345678', 'طرابلس، ليبيا', 'شركة البناء الحديث'),
('فاطمة علي', 'fatima@example.com', '+218923456789', 'بنغازي، ليبيا', 'مؤسسة التطوير'),
('محمد حسن', 'mohamed@example.com', '+218934567890', 'مصراتة، ليبيا', 'شركة الإنشاءات'),
('عائشة أحمد', 'aisha@example.com', '+218945678901', 'الزاوية، ليبيا', 'مصنع المواد'),
('علي محمود', 'ali@example.com', '+218956789012', 'سرت، ليبيا', 'شركة المقاولات');

-- إدخال بيانات تجريبية للمنتجات
INSERT INTO products (name, description, price, category_id, stock, sku, barcode, weight, dimensions, supplier, cost_price, min_stock_level, max_stock_level) 
SELECT 
    p.name,
    p.description,
    p.price,
    c.id as category_id,
    p.stock,
    p.sku,
    p.barcode,
    p.weight,
    p.dimensions,
    p.supplier,
    p.cost_price,
    p.min_stock_level,
    p.max_stock_level
FROM (
    VALUES 
    ('مواسير PVC', 'مواسير PVC عالية الجودة للمشاريع الهندسية', 150.0, 'مواسير', 100, 'PVC-001', '1234567890', 2.5, '6m × 110mm', 'شركة البناء الحديث', 120.0, 20, 200),
    ('صمامات نحاسية', 'صمامات نحاسية مقاومة للصدأ', 85.5, 'صمامات', 50, 'VALVE-001', '1234567891', 0.5, '1/2 inch', 'مصنع الصمامات المتطور', 65.0, 10, 100),
    ('محابس حديد', 'محابس حديد مجلفن للمياه', 120.0, 'محابس', 75, 'TAP-001', '1234567892', 1.2, '3/4 inch', 'شركة المحابس العالمية', 90.0, 15, 150),
    ('أدوات لحام', 'أدوات لحام احترافية', 250.0, 'أدوات', 25, 'WELD-001', '1234567893', 3.0, '30cm × 15cm', 'مؤسسة الأدوات المهنية', 180.0, 5, 50),
    ('عوازل حرارية', 'عوازل حرارية للمباني', 180.0, 'عوازل', 60, 'INSUL-001', '1234567894', 1.8, '1m × 0.5m', 'شركة العزل المتقدم', 140.0, 12, 120),
    ('كابلات كهربائية', 'كابلات كهربائية عالية الجودة', 95.0, 'كهربائيات', 200, 'CABLE-001', '1234567895', 0.8, '100m roll', 'مصنع الكابلات الكهربائية', 70.0, 30, 300),
    ('مفاتيح كهربائية', 'مفاتيح كهربائية حديثة', 45.0, 'كهربائيات', 150, 'SWITCH-001', '1234567896', 0.2, '8cm × 4cm', 'شركة المفاتيح الذكية', 30.0, 25, 200),
    ('طابوق بناء', 'طابوق بناء عالي الجودة', 2.5, 'بناء', 5000, 'BRICK-001', '1234567897', 2.8, '24cm × 11.5cm × 7cm', 'مصنع الطابوق الوطني', 1.8, 500, 10000),
    ('أسمنت بورتلاند', 'أسمنت بورتلاند عادي', 35.0, 'بناء', 300, 'CEMENT-001', '1234567898', 50.0, '50kg bag', 'شركة الأسمنت الوطنية', 25.0, 50, 500),
    ('حديد تسليح', 'حديد تسليح للمباني', 2800.0, 'حديد', 20, 'STEEL-001', '1234567899', 1000.0, '12m length', 'مصنع الحديد المتطور', 2200.0, 5, 50),
    ('أبواب خشبية', 'أبواب خشبية فاخرة', 850.0, 'أبواب ونوافذ', 15, 'DOOR-001', '1234567900', 25.0, '2.1m × 0.9m', 'مصنع الأبواب الفاخرة', 650.0, 3, 30),
    ('نوافذ ألمنيوم', 'نوافذ ألمنيوم عازلة', 1200.0, 'أبواب ونوافذ', 10, 'WINDOW-001', '1234567901', 15.0, '1.2m × 1.5m', 'شركة النوافذ الحديثة', 900.0, 2, 20),
    ('دهانات جدران', 'دهانات جدران عالية الجودة', 75.0, 'دهانات', 80, 'PAINT-001', '1234567902', 5.0, '5L bucket', 'مصنع الدهانات المتطور', 55.0, 10, 100),
    ('بلاط سيراميك', 'بلاط سيراميك فاخر', 45.0, 'بلاط', 400, 'TILE-001', '1234567903', 1.2, '30cm × 30cm', 'مصنع البلاط الفاخر', 32.0, 50, 600),
    ('أدوات يدوية', 'مجموعة أدوات يدوية شاملة', 180.0, 'أدوات', 30, 'TOOLS-001', '1234567904', 2.5, '40cm × 25cm × 10cm', 'شركة الأدوات المهنية', 130.0, 5, 60)
) AS p(name, description, price, category_name, stock, sku, barcode, weight, dimensions, supplier, cost_price, min_stock_level, max_stock_level)
JOIN categories c ON c.name = p.category_name;
