import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const user = supabase.user();
  
  if (user) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
