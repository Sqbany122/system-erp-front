export interface Pipeline {
  id: string;
  owner: string;
  name: string;
  nip: string;
  status: string;
  created_at: string;
  updated_at?: string;
  gus_data?: {
    Gmina?: string;
    Ulica?: string;
    Miejscowosc?: string;
    KodPocztowy?: string;
    Regon?: string;
  };
  additional_info?: {
    pipeline?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    note?: string;
  };
  comments?: Array<Comments>;
  files?: Array<Files>;
}
  
interface Comments {
  pipeline?: string;
  owner?: string;
  comment?: string;
  created_at?: string;
  private?: string;
}

interface Files {
  pipeline?: string;
  owner?: string;
  file?: string;
  file_path?: string;
  file_extension?: string;
  file_description?: string;
  created_at?: string;
}
  