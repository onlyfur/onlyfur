# OnlyFur Platform v3.9.5 Release Notes

**Release Date**: June 10, 2025
**Version**: 3.9.5

## 🔧 Bug Fixes & Improvements

### Authentication System
- **Fixed Google OAuth Login Error**: Resolved "Authorization code flow not implemented yet" error
  - Updated GoogleLoginButton component to use direct credential flow instead of authorization code flow
  - Ensures compatibility with existing backend authentication implementation
  - Improved error handling for unconfigured OAuth clients

### UI/UX Enhancements
- **Fixed Neural Search Dark Mode Support**: Corrected styling issues in neural search modal
  - Added proper dark mode variants for gradient backgrounds
  - Fixed badge colors to display correctly in dark theme
  - Updated information panels to support dark mode
  - Enhanced visual consistency across light and dark themes

### Security & Production Readiness
- **Removed Demo Credentials**: Eliminated demo user credentials from login page
  - Removed test credentials display for better security
  - Cleaner production-ready login interface
  - Enhanced professional appearance

## 🔄 Technical Changes

### Frontend Updates
- `src/components/auth/GoogleLoginButton.tsx`
  - Switched from manual OAuth authorization code flow to GoogleLogin component
  - Added proper Google OAuth provider wrapper
  - Improved error handling and user feedback

- `src/components/search/NeuralSearchModal.tsx`
  - Added dark mode support with `dark:` variants
  - Fixed hardcoded light backgrounds
  - Improved color contrast for better accessibility

- `src/pages/Login.tsx`
  - Removed demo credentials section
  - Streamlined login interface

### Package Updates
- Updated version number to v3.9.5
- Maintained compatibility with existing dependencies

## 🧪 Testing Notes
- Google OAuth now uses direct credential flow compatible with backend
- Neural search displays correctly in both light and dark modes
- Login page is production-ready without demo credentials

## 📦 Deployment
This version is ready for immediate deployment. All changes are backward compatible and improve existing functionality without breaking changes.

---

**Previous Version**: v3.9.4
**Upgrade Path**: Direct replacement - no database migrations required
