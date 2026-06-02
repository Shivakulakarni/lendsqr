import { http, HttpResponse } from 'msw';
import { generateMockUsers } from './mockData';
import { PaginatedResponse } from '../types';

// Generate all users once at startup
const allUsers = generateMockUsers(500);

export const handlers = [
  // Get paginated users list with search
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('perPage') || '10');
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status') || '';

    // Filter users based on search and status
    let filtered = allUsers;

    if (search) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phoneNumber.includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(user => user.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    const response: PaginatedResponse = {
      data: paginatedUsers,
      page,
      perPage,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / perPage),
    };

    return HttpResponse.json(response);
  }),

  // Get single user by ID
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = allUsers.find(u => u.id === id);

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(user);
  }),

  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string; fullName?: string };

    // Mock auth - accept any email/password
    if (body.email && body.password) {
      return HttpResponse.json({
        token: 'mock-jwt-token-' + Math.random().toString(36),
        user: { 
          email: body.email,
          fullName: body.fullName 
        },
        message: 'Login successful'
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),
];
