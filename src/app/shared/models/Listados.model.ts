export interface ListadoModel<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface FiltrosList {
  page?: string | number;
  roleName?: string;
  userId?: number;
  filter?: string;
  link: null | string;
  estado?: string | number;
  status_pagado?: string | number;
  dateIni?: string;
  dateFin?: string;
  allDates?: boolean;
}
