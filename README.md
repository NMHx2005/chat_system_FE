# Chat System Frontend (Phase 1)

## Overview
Frontend Angular application for a text/video chat system (MEAN stack). Phase 1 focuses on UI/UX with mocked data, authentication, role-based access (Super Admin, Group Admin, User), and page routing. Phase 2 will integrate Express + MongoDB + Socket.io + Peer.js.

## Tech Stack
- Angular 18 (standalone components, lazy routes)
- TypeScript, SCSS
- Angular Material + Material Icons
- Angular Router, Forms, Reactive Forms

## What's New (Phase 1 updates)
- Common layouts:
  - `ClientLayoutComponent`: sticky header + footer for all client pages
  - `AdminLayoutComponent`: sidebar + header for all admin pages
- Material UI refactor for all pages (admin and client)
- New homepage `/home` introducing the project
- Chat page redesigned like Messenger: left sidebar groups, main chat, right info pane
- Admin Dashboard standardized with quick shortcuts and data badges
- Admin Group Detail with tabs (overview, members, channels) + inline member add/remove + quick create channel
- Client Group Detail page
- All routes consolidated and guarded (`AuthGuard`, `RoleGuard`)

## Project Structure (frontend)
```
src/app/
  app.routes.ts
  app.config.ts
  app.component.ts
  components/
    layouts/
      admin-layout.component.ts
      client-layout.component.ts
    home/
      home.component.ts
    dashboard/
      dashboard.component.ts
    chat/
      chat.component.ts
    channels/
      channels.component.ts
    groups/
      group-interest.component.ts
      client-group-detail.component.ts
    profile/
      profile.component.ts
    admin/
      admin-dashboard.component.ts
      manage-users.component.ts
      manage-groups.component.ts
      manage-channels.component.ts
      group-detail.component.ts
  guards/
    auth.guard.ts
    role.guard.ts
  models/
    user.model.ts
    group.model.ts
    channel.model.ts
    message.model.ts
    index.ts
  services/
    auth.service.ts
```

## Routes
```text
/                → redirect /home
/home            → HomeComponent (public landing)
/login           → LoginComponent
/register        → RegisterComponent
/dashboard       → DashboardComponent (AuthGuard)
/profile         → ProfileComponent (AuthGuard)
/chat            → ChatComponent (AuthGuard)
/group/:groupId/channel/:channelId → ChatComponent (AuthGuard)
/channels        → ChannelsComponent (AuthGuard)
/groups          → GroupInterestComponent (AuthGuard)
/groups/:groupId → ClientGroupDetailComponent (AuthGuard)

/admin                       → AdminDashboardComponent (AuthGuard + RoleGuard: GROUP_ADMIN, SUPER_ADMIN)
/admin/users                 → ManageUsersComponent (RoleGuard)
/admin/groups                → ManageGroupsComponent (RoleGuard)
/admin/groups/:groupId       → AdminGroupDetailComponent (RoleGuard)
/admin/channels              → ManageChannelsComponent (RoleGuard)
/admin/groups/:groupId/channels → ManageChannelsComponent (RoleGuard)
```

## Pages & Key UI
- Client
  - Home: project intro, features, CTA
  - Chat: sidebar groups, messages list, message composer, info/members pane
  - Groups: browse/join, status chips, filters (Material)
  - Group Detail (client): overview, channels, quick open chat
  - Channels: list + join
  - Profile: user info
- Admin
  - Admin Dashboard: quick actions (Users/Groups/Channels) with `matBadge` counts, recent activity
  - Manage Users: Material table, search/filter, role/status chips, actions
  - Manage Groups: Material table, create group dialog, view group
  - Group Detail (admin): tabs (Overview/Members/Channels), add/remove member, quick create channel
  - Manage Channels: Material table, create channel dialog

## Guards & Roles
- Roles: `SUPER_ADMIN`, `GROUP_ADMIN`, `USER`
- `AuthGuard`: requires login
- `RoleGuard`: checks route `data.roles`

## Data & Mocking (Phase 1)
- Storage: `localStorage` for users, groups, channels, messages
- Default account: username `super`, password `123`
- Chat messages per-group stored as `messages_<groupId>` (basic history shown)

## Models (simplified)
```ts
// user.model.ts
export interface User {
  id: string;
  username: string;
  email: string;
  roles: ('SUPER_ADMIN'|'GROUP_ADMIN'|'USER')[];
  groups: string[];
  createdAt: Date; updatedAt: Date; isActive: boolean;
}

// group.model.ts
export enum GroupStatus { ACTIVE='ACTIVE', INACTIVE='INACTIVE', PENDING='PENDING' }
export interface Group {
  id: string; name: string; description: string;
  category?: string; status: GroupStatus;
  members: string[]; channels: string[]; memberCount?: number;
  createdAt: Date; updatedAt: Date;
}

// channel.model.ts
export enum ChannelType { TEXT='TEXT', VOICE='VOICE', VIDEO='VIDEO' }
export interface Channel {
  id: string; name: string; description: string;
  groupId: string; type: ChannelType; isActive: boolean;
  createdBy: string; createdAt: Date; updatedAt: Date;
  members: string[]; bannedUsers: string[]; memberCount?: number; maxMembers?: number;
}

// message.model.ts
export interface Message {
  id: string; channelId: string; userId?: string; username: string;
  text: string; timestamp: Date; type?: 'text'|'image'|'file';
}
```

## How to Run
```bash
# install
npm install

# dev
npm start
# or
ng serve

# build
npm run build
```

## Phase 2 (Backend & Realtime)
- Express REST APIs (users, groups, channels, auth)
- MongoDB for persistence
- Socket.io for real-time chat
- Peer.js for video calls
- File uploads for avatar and chat attachments

## Notes
- Material Icons included in `src/index.html`
- All admin/client pages themed with Material Design
- Responsive across breakpoints (768px/1024px)

---

# 📚 Documentation & Planning

## 🎯 Project Phases & Roadmap

### Phase 1: Frontend Foundation ✅ (COMPLETED)
**Timeline**: Completed
**Focus**: UI/UX, Mock Data, Basic Authentication
**Deliverables**:
- ✅ Complete Angular application structure
- ✅ Material Design implementation
- ✅ Role-based routing and guards
- ✅ Mock authentication system
- ✅ Responsive layouts for admin and client
- ✅ Chat interface (Messenger-style)
- ✅ Group and channel management UI

### Phase 2: Backend Integration 🚧 (PLANNED)
**Timeline**: Current Phase
**Focus**: MongoDB Integration, Real APIs, Authentication
**Deliverables**:
- MongoDB database setup
- Express.js REST APIs
- JWT authentication
- Real-time data persistence
- API service integration
- Error handling and validation
- 
**Timeline**: Next Phase
**Focus**: WebSocket, Live Chat, Notifications
**Deliverables**:
- 📋 Socket.io integration
- 📋 Real-time messaging
- 📋 Online/offline status
- 📋 Push notifications
- 📋 Message delivery status
- 📋 Typing indicators
- 
**Timeline**: Future
**Focus**: Video Calls, File Sharing, Advanced UI
**Deliverables**:
- 📋 Peer.js video calling
- 📋 File upload/download
- 📋 Image sharing
- 📋 Voice messages
- 📋 Advanced search
- 📋 User presence

## 🏗️ Architecture Documentation

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Application                      │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                           │
│  ├── Layout Components (Admin/Client)                       │
│  ├── Feature Components (Chat, Groups, Channels)            │
│  └── Shared Components (UI Elements)                        │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                             │
│  ├── Auth Service (Authentication)                          │
│  ├── API Services (HTTP calls)                              │
│  ├── State Management (User, Groups, Messages)              │
│  └── WebSocket Service (Real-time)                          │
├─────────────────────────────────────────────────────────────┤
│  Guards & Interceptors                                      │
│  ├── Auth Guard (Route Protection)                          │
│  ├── Role Guard (Permission Control)                        │
│  └── HTTP Interceptor (Token Management)                    │
├─────────────────────────────────────────────────────────────┤
│  Models & Interfaces                                        │
│  ├── User, Group, Channel, Message Models                   │
│  ├── API Response Interfaces                                │
│  └── State Management Interfaces                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture
```
User Action → Component → Service → API → Database
     ↑                                           ↓
     └── Response ← Service ← Component ← UI Update
```

### State Management Strategy
- **Local State**: Component-level state using Angular signals
- **Shared State**: Service-based state management
- **Persistent State**: LocalStorage + API synchronization
- **Real-time State**: WebSocket event-driven updates

## 🔧 Technical Specifications

### Performance Requirements
- **Initial Load**: < 3 seconds
- **Route Navigation**: < 500ms
- **API Response**: < 2 seconds
- **Real-time Updates**: < 100ms
- **Bundle Size**: < 2MB (gzipped)

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile**: iOS 12+, Android 8+

### Responsive Breakpoints
```scss
// Mobile First Approach
$breakpoints: (
  xs: 0,      // Mobile
  sm: 576px,  // Small tablets
  md: 768px,  // Tablets
  lg: 992px,  // Desktop
  xl: 1200px, // Large desktop
  xxl: 1400px // Extra large
);
```

## 📋 API Integration Plan

### Authentication Endpoints
```typescript
// Planned API Structure
interface AuthAPI {
  POST /api/auth/register    // User registration
  POST /api/auth/login       // User login
  POST /api/auth/logout      // User logout
  POST /api/auth/refresh     // Token refresh
  GET  /api/auth/me          // Current user info
}
```

### Core API Endpoints
```typescript
// Users Management
interface UsersAPI {
  GET    /api/users          // List users (Admin)
  GET    /api/users/:id      // Get user by ID
  POST   /api/users          // Create user (Admin)
  PUT    /api/users/:id      // Update user
  DELETE /api/users/:id      // Delete user (Admin)
}

// Groups Management
interface GroupsAPI {
  GET    /api/groups                    // List groups
  GET    /api/groups/:id                // Get group by ID
  POST   /api/groups                    // Create group
  PUT    /api/groups/:id                // Update group
  DELETE /api/groups/:id                // Delete group
  POST   /api/groups/:id/members        // Add member
  DELETE /api/groups/:id/members/:userId // Remove member
}

// Channels Management
interface ChannelsAPI {
  GET    /api/channels                   // List channels
  GET    /api/channels/:id               // Get channel by ID
  POST   /api/channels                   // Create channel
  PUT    /api/channels/:id               // Update channel
  DELETE /api/channels/:id               // Delete channel
  POST   /api/channels/:id/members       // Add member
  DELETE /api/channels/:id/members/:userId // Remove member
}

// Messages Management
interface MessagesAPI {
  GET    /api/messages/channel/:channelId // Get channel messages
  GET    /api/messages/:id                // Get message by ID
  POST   /api/messages                    // Create message
  PUT    /api/messages/:id                // Update message
  DELETE /api/messages/:id                // Delete message
  GET    /api/messages/search             // Search messages
}
```

## 🧪 Testing Strategy

### Unit Testing
- **Components**: Angular TestBed + Jasmine
- **Services**: Mock HTTP + Service isolation
- **Guards**: Route testing + Permission validation
- **Coverage Target**: > 80%

### Integration Testing
- **API Integration**: HTTP interceptor testing
- **Route Guards**: Navigation flow testing
- **State Management**: Service interaction testing

### E2E Testing
- **User Flows**: Login → Dashboard → Chat
- **Admin Flows**: User management → Group creation
- **Cross-browser**: Chrome, Firefox, Safari

## 🚀 Deployment Strategy

### Development Environment
- **Local**: `ng serve` (localhost:4200)
- **Hot Reload**: Enabled for development
- **Environment**: Development config

### Staging Environment
- **Build**: `ng build --configuration staging`
- **Deploy**: Docker container
- **Database**: Staging MongoDB instance
- **Testing**: Integration testing

### Production Environment
- **Build**: `ng build --configuration production`
- **Deploy**: Cloud platform (AWS/Azure/GCP)
- **Database**: Production MongoDB cluster
- **Monitoring**: Performance monitoring + error tracking

## 📊 Performance Monitoring

### Key Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Application Metrics**: Route load time, API response time
- **User Experience**: Error rates, user engagement

### Monitoring Tools
- **Frontend**: Angular DevTools, Lighthouse
- **Backend**: MongoDB Compass, API monitoring
- **Real-time**: WebSocket connection monitoring

## 🔒 Security Considerations

### Authentication Security
- **JWT Tokens**: Secure token storage
- **Password Policy**: Strong password requirements
- **Session Management**: Token expiration handling
- **CSRF Protection**: Cross-site request forgery prevention

### Data Security
- **Input Validation**: XSS prevention
- **Output Encoding**: HTML encoding
- **HTTPS**: Secure communication
- **Data Encryption**: Sensitive data encryption

### Authorization Security
- **Role-based Access**: Granular permission control
- **Route Protection**: Guard-based access control
- **API Security**: Endpoint permission validation

## 📈 Future Enhancements

### Advanced Features
- **AI Chat Assistant**: Smart message suggestions
- **Advanced Search**: Full-text search + filters
- **Custom Themes**: User-defined color schemes
- **Multi-language**: Internationalization support

### Mobile Features
- **PWA Support**: Progressive Web App
- **Push Notifications**: Mobile notifications
- **Offline Support**: Offline message queuing
- **Mobile Optimization**: Touch-friendly interface

### Analytics & Insights
- **User Analytics**: Usage patterns, engagement metrics
- **Performance Analytics**: System performance monitoring
- **Business Intelligence**: Chat analytics, user behavior

---

Last Updated: 2025-09-02
Status: Phase 1 (Frontend) ✅ | Phase 2 (Backend Integration) 🚧 | Phase 3 (Real-time) 📋
