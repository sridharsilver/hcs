export interface Branch {
  id: string;
  name: string;
  area: string;
  slug: string;
  campus_number: string;
  principal_name: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  maps_url: string;
  established: string;
  facilities: string[];
  image_url: string;
  status: 'Active' | 'Inactive';
  student_count?: number;
  teacher_count?: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_count?: number;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
// ... existing code ...
  id: string;
  full_name: string;
  admission_number: string;
  class: string;
  section: string;
  branch_id: string;
  branch_name?: string;
  gender: string;
  date_of_birth: string;
  parent_name: string;
  mobile_number: string;
  email: string;
  address: string;
  photo_url: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  full_name: string;
  employee_id: string;
  subject: string;
  branch_id: string;
  branch_name?: string;
  qualification: string;
  experience: string;
  phone_number: string;
  email: string;
  address: string;
  joining_date: string;
  photo_url: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Sports' | 'Campus' | 'Annual Day' | 'Classrooms' | 'Activities';
  branch_id: string;
  branch_name?: string;
  image_url: string;
  description: string;
  upload_date: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface SchoolSettings {
  school_name: string;
  logo_url: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  footer_text: string;
  theme_color: string;
}
export interface Fee {
  id: string;
  student_id: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  last_payment_date: string | null;
  due_date: string | null;
  status: 'Paid' | 'Partial' | 'Overdue';
  remarks: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  student?: Student;
}

export interface FeePayment {
  id: string;
  fee_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  remarks: string | null;
  created_at: string;
  created_by?: string;
  proof_url?: string;
}

export interface Enquiry {
  id: string;
  parent_name: string;
  child_name: string;
  phone: string;
  email: string;
  grade: string;
  campus: string;
  message: string | null;
  status: 'Pending' | 'Contacted' | 'Closed';
  created_at: string;
}
