# Chat System Frontend

## 📋 Project Overview

A text/video chat system using MEAN stack with modern and responsive interface. The project is divided into 2 phases:

- **Phase 1**: Frontend development with mock data, authentication, role management, UI/UX
- **Phase 2**: Backend integration, real-time features (Socket.io, Peer.js), MongoDB

## 🚀 Technologies Used

### Frontend Framework
- **Angular 18** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript development
- **SCSS** - Advanced CSS preprocessing
- **Angular Material** - UI component library

### Build Tools & Dependencies
- **Angular CLI** - Development and build tools
- **Zone.js** - Change detection and async operations
- **RxJS** - Reactive programming library
- **Angular Router** - Client-side routing with lazy loading

### Styling & UI/UX
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Variables** - Dynamic theming
- **Responsive Design** - Mobile-first approach
- **CSS Animations** - Smooth transitions and hover effects

## 🏗️ Project Structure

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

## 📱 Accessible Pages

### 🔐 Authentication
- **`/login`** - System login
  - Form validation
  - Mock authentication
  - Remember me functionality

### 🏠 Client Pages (Client Layout)
- **`/chat`** - Main chat interface
  - Real-time messaging interface
  - Online members sidebar
  - Message history
  - Quick actions (mute, pin, invite)

- **`/groups`** - Groups management
  - My groups display
  - Available groups
  - Join/leave functionality
  - Search and filter

- **`/channels`** - Channels management
  - My channels
  - Available channels
  - Group filtering
  - Channel search

### 👑 Admin Pages (Admin Layout)
- **`/dashboard`** - Main dashboard
  - Welcome section
  - Quick stats (groups, channels, messages, users)
  - Quick actions
  - Recent activity feed

- **`/admin/users`** - User management
  - User table with search/filter
  - Role management
  - User actions (edit, delete, view)
  - Bulk operations
  - Pagination

- **`/admin/groups`** - Groups management (Super Admin)
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

- **`/admin/create-group`** - Create new group
  - Group information form
  - Default channels setup
  - Member invitations
  - Permission settings
  - Advanced options

## 🎨 Interface & UX

### Layout Components
- **AdminLayoutComponent**: Header + Sidebar + Content area
  - Gradient header with user info
  - Responsive sidebar navigation
  - Page title and description
  - Action buttons slot

- **ClientLayoutComponent**: Header + Content area
  - Sticky header with navigation
  - Logo and main menu
  - Page header with actions
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
  - Cards with shadow and border radius
  - Buttons with hover effects
  - Form inputs with focus states
  - Tables with hover rows
  - Responsive grids

### Responsive Features
- **Mobile-first approach**
- **Breakpoints**: 768px, 1024px, 1200px
- **Flexible layouts** with CSS Grid
- **Touch-friendly** interactions
- **Optimized** for mobile devices

## 🔒 Authentication & Authorization

### User Roles
- **Super Admin**: Full system access
- **Group Admin**: Group management
- **User**: Basic chat functionality

### Route Guards
- **AuthGuard**: Protects routes requiring login
- **RoleGuard**: Checks access permissions by role

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
# or
npm start
```

### Build Production
```bash
ng build
# or
npm run build
```

### Build Analysis
```bash
ng build --stats-json
```

## 📁 File Structure Details

### Components Organization
- **Standalone Components**: Each component is independent
- **Lazy Loading**: Components are loaded when needed
- **Shared Layouts**: Separate Admin and Client layouts
- **Responsive Design**: Mobile-first approach

### Services & State Management
- **AuthService**: Manages authentication state
- **BehaviorSubject**: Reactive state updates
- **LocalStorage**: Session persistence
- **Route Guards**: Navigation protection

### Styling Strategy
- **Component-scoped Styles**: Each component has its own styles
- **Global Styles**: Common utilities and variables
- **CSS Custom Properties**: Dynamic theming
- **Responsive Mixins**: Mobile-first breakpoints

## 🔮 Phase 2 Features (Future)

### Backend Integration
- **Express.js Server**: RESTful API endpoints
- **MongoDB**: Database integration
- **JWT Authentication**: Token-based auth
- **File Upload**: Image and video support

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
- **Memory Usage**: Optimized with standalone components

## 🔧 Configuration Files

- **angular.json**: Build configuration
- **tsconfig.json**: TypeScript settings
- **package.json**: Dependencies and scripts
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
5. **Testing**: Unit and integration tests
6. **Deployment**: Production build and hosting

---

**Version**: 1.0.0 (Phase 1 Complete)  
**Last Updated**: August 31, 2025  
**Status**: Frontend Development Complete ✅
