# Chat System Frontend

## 📋 Tổng Quan Dự Án

Hệ thống chat text/video sử dụng MEAN stack với giao diện hiện đại và responsive. Dự án được chia thành 2 phases:

- **Phase 1**: Frontend development với mock data, authentication, role management, UI/UX
- **Phase 2**: Backend integration, real-time features (Socket.io, Peer.js), MongoDB

## 🚀 Công Nghệ Sử Dụng

### Frontend Framework
- **Angular 18** - Modern web framework với standalone components
- **TypeScript** - Type-safe JavaScript development
- **SCSS** - Advanced CSS preprocessing
- **Angular Material** - UI component library

### Build Tools & Dependencies
- **Angular CLI** - Development and build tools
- **Zone.js** - Change detection and async operations
- **RxJS** - Reactive programming library
- **Angular Router** - Client-side routing với lazy loading

### Styling & UI/UX
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Variables** - Dynamic theming
- **Responsive Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions và hover effects

## 🏗️ Cấu Trúc Dự Án

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   └── login.component.ts          # Login form
│   │   ├── layout/
│   │   │   ├── admin-layout.component.ts   # Admin layout wrapper
│   │   │   ├── client-layout.component.ts  # Client layout wrapper
│   │   │   └── dashboard.component.ts      # Main dashboard
│   │   ├── chat/
│   │   │   ├── chat.component.ts           # Chat interface
│   │   │   ├── groups.component.ts         # Groups management
│   │   │   └── channels.component.ts       # Channels management
│   │   └── admin/
│   │       ├── users.component.ts          # User management
│   │       ├── groups.component.ts         # Admin groups
│   │       ├── my-groups.component.ts      # My groups
│   │       └── create-group.component.ts   # Create group form
│   ├── models/
│   │   ├── user.model.ts                   # User interfaces
│   │   ├── group.model.ts                  # Group interfaces
│   │   ├── channel.model.ts                # Channel interfaces
│   │   ├── message.model.ts                # Message interfaces
│   │   └── index.ts                        # Model exports
│   ├── services/
│   │   └── auth.service.ts                 # Authentication service
│   ├── guards/
│   │   ├── auth.guard.ts                   # Route protection
│   │   └── role.guard.ts                   # Role-based access
│   ├── app.routes.ts                       # Application routing
│   ├── app.config.ts                       # App configuration
│   └── app.component.ts                    # Root component
├── environments/
│   ├── environment.ts                       # Development config
│   └── environment.prod.ts                  # Production config
└── styles.scss                              # Global styles
```

## 📱 Các Trang Có Thể Truy Cập

### 🔐 Authentication
- **`/login`** - Đăng nhập hệ thống
  - Form validation
  - Mock authentication
  - Remember me functionality

### 🏠 Client Pages (Client Layout)
- **`/chat`** - Giao diện chat chính
  - Real-time messaging interface
  - Online members sidebar
  - Message history
  - Quick actions (mute, pin, invite)

- **`/groups`** - Quản lý groups
  - My groups display
  - Available groups
  - Join/leave functionality
  - Search và filter

- **`/channels`** - Quản lý channels
  - My channels
  - Available channels
  - Group filtering
  - Channel search

### 👑 Admin Pages (Admin Layout)
- **`/dashboard`** - Dashboard chính
  - Welcome section
  - Quick stats (groups, channels, messages, users)
  - Quick actions
  - Recent activity feed

- **`/admin/users`** - Quản lý users
  - User table với search/filter
  - Role management
  - User actions (edit, delete, view)
  - Bulk operations
  - Pagination

- **`/admin/groups`** - Quản lý groups (Super Admin)
  - Groups table
  - Admin filtering
  - Status management
  - Bulk actions
  - Export functionality

- **`/admin/my-groups`** - My Groups (Group Admin)
  - Admin groups overview
  - Member groups
  - Group statistics
  - Management actions

- **`/admin/create-group`** - Tạo group mới
  - Group information form
  - Default channels setup
  - Member invitations
  - Permission settings
  - Advanced options

## 🎨 Giao Diện & UX

### Layout Components
- **AdminLayoutComponent**: Header + Sidebar + Content area
  - Gradient header với user info
  - Responsive sidebar navigation
  - Page title và description
  - Action buttons slot

- **ClientLayoutComponent**: Header + Content area
  - Sticky header với navigation
  - Logo và main menu
  - Page header với actions
  - Responsive design

### Design System
- **Color Palette**:
  - Primary: #667eea (Blue)
  - Success: #27ae60 (Green)
  - Info: #17a2b8 (Cyan)
  - Warning: #f39c12 (Orange)
  - Danger: #e74c3c (Red)
  - Neutral: #95a5a6 (Gray)

- **Typography**:
  - Headings: #2c3e50 (Dark Blue)
  - Body text: #7f8c8d (Medium Gray)
  - Labels: #95a5a6 (Light Gray)

- **Components**:
  - Cards với shadow và border radius
  - Buttons với hover effects
  - Form inputs với focus states
  - Tables với hover rows
  - Responsive grids

### Responsive Features
- **Mobile-first approach**
- **Breakpoints**: 768px, 1024px, 1200px
- **Flexible layouts** với CSS Grid
- **Touch-friendly** interactions
- **Optimized** cho mobile devices

## 🔒 Authentication & Authorization

### User Roles
- **Super Admin**: Full system access
- **Group Admin**: Group management
- **User**: Basic chat functionality

### Route Guards
- **AuthGuard**: Bảo vệ routes yêu cầu đăng nhập
- **RoleGuard**: Kiểm tra quyền truy cập theo role

### Mock Data
- **Default User**: super / 123
- **User Sessions**: localStorage persistence
- **Role-based Access**: Dynamic navigation

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  groups: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Group Model
```typescript
interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  admins: string[];
  members: string[];
  channels: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Channel Model
```typescript
interface Channel {
  id: string;
  name: string;
  description: string;
  groupId: string;
  createdBy: string;
  members: string[];
  bannedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Message Model
```typescript
interface Message {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  username: string;
  timestamp: Date;
  isEdited: boolean;
}
```

## 🚀 Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
ng serve
# hoặc
npm start
```

### Build Production
```bash
ng build
# hoặc
npm run build
```

### Build Analysis
```bash
ng build --stats-json
```

## 📁 File Structure Details

### Components Organization
- **Standalone Components**: Mỗi component là independent
- **Lazy Loading**: Components được load khi cần
- **Shared Layouts**: Admin và Client layouts riêng biệt
- **Responsive Design**: Mobile-first approach

### Services & State Management
- **AuthService**: Quản lý authentication state
- **BehaviorSubject**: Reactive state updates
- **LocalStorage**: Session persistence
- **Route Guards**: Navigation protection

### Styling Strategy
- **Component-scoped Styles**: Mỗi component có styles riêng
- **Global Styles**: Common utilities và variables
- **CSS Custom Properties**: Dynamic theming
- **Responsive Mixins**: Mobile-first breakpoints

## 🔮 Phase 2 Features (Future)

### Backend Integration
- **Express.js Server**: RESTful API endpoints
- **MongoDB**: Database integration
- **JWT Authentication**: Token-based auth
- **File Upload**: Image và video support

### Real-time Features
- **Socket.io**: Real-time messaging
- **Peer.js**: Video chat functionality
- **Live Updates**: Real-time notifications
- **Presence System**: Online/offline status

### Advanced Features
- **Search & Filter**: Advanced content discovery
- **User Management**: Profile editing, avatar upload
- **Group Permissions**: Granular access control
- **Message History**: Persistent chat logs

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🛠️ Development Tools

- **Angular DevTools**: Browser extension
- **Angular CLI**: Command line tools
- **TypeScript Compiler**: Type checking
- **SCSS Compiler**: CSS preprocessing

## 📊 Performance Metrics

- **Bundle Size**: 567.83 kB (Initial)
- **Lazy Chunks**: 11 components
- **Build Time**: ~5-9 seconds
- **Memory Usage**: Optimized với standalone components

## 🔧 Configuration Files

- **angular.json**: Build configuration
- **tsconfig.json**: TypeScript settings
- **package.json**: Dependencies và scripts
- **polyfills.ts**: Browser compatibility

## 📚 Dependencies

### Core Dependencies
- `@angular/core`: 18.x
- `@angular/common`: 18.x
- `@angular/router`: 18.x
- `@angular/forms`: 18.x
- `@angular/material`: 18.x

### Development Dependencies
- `@angular-devkit/build-angular`: 18.x
- `@angular/cli`: 18.x
- `typescript`: 5.x
- `zone.js`: 0.15.x

## 🎯 Next Steps

1. **Backend Development**: Express.js server setup
2. **Database Integration**: MongoDB connection
3. **Real-time Features**: Socket.io implementation
4. **Video Chat**: Peer.js integration
5. **Testing**: Unit và integration tests
6. **Deployment**: Production build và hosting

---

**Version**: 1.0.0 (Phase 1 Complete)  
**Last Updated**: August 31, 2025  
**Status**: Frontend Development Complete ✅
