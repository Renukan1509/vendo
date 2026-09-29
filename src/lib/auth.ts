import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { User, Role } from './types';
import { findUserById } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'vendogo-secret-key-2026-production-smart-vending';
const COOKIE_NAME = 'vendogo_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Extract authenticated user from Request (cookie or Bearer Authorization header)
export function getAuthUserFromRequest(req: NextRequest): TokenPayload | null {
  // Check cookie
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) return verified;
  }

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7);
    const verified = verifyToken(bearerToken);
    if (verified) return verified;
  }

  return null;
}

// Get full User model from database using request
export function getCurrentUser(req: NextRequest): User | null {
  const tokenUser = getAuthUserFromRequest(req);
  if (!tokenUser) return null;
  const user = findUserById(tokenUser.userId);
  return user || null;
}

export { COOKIE_NAME };
