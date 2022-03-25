export interface Order {
    id: string;
    owner: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    priority: string;
    project_group: string;
    project: string;
    order_category: string;
    status: string;
    created_at: string;
    updated_at?: string;
    orginal_price?: string;
    currency_name?: string;
    email?: string;
  }
  