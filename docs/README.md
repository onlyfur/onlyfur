# 📚 OnlyFur Platform Documentation

Welcome to the OnlyFur Platform documentation! This directory contains all the guides, tutorials, and reference materials you need to understand, develop, deploy, and maintain the platform.

## 📖 **Documentation Structure**

```
docs/
├── README.md                    # This overview file
├── development/                 # Local development setup and guides
├── deployment/                  # Production deployment guides
├── guides/                      # Feature-specific guides and tutorials
├── troubleshooting/             # Problem-solving and debugging
└── release-notes/               # Version history and changes
```

## 🚀 **Quick Start for New Developers**

### **📋 Essential Reading Order**

**For new developers joining the team, read these in order:**

1. **[Development Setup Guide](development/LOCAL_DEVELOPMENT.md)** ⭐ **START HERE**
   - Complete local development environment setup
   - Database configuration and seeding
   - Test users and authentication

2. **[Cross-Platform Setup](development/CROSS_PLATFORM_SETUP.md)**
   - Windows, macOS, and Linux compatibility
   - Docker and alternative installation methods
   - Troubleshooting for different operating systems

3. **[Main README](../README.md)**
   - Project overview and basic commands
   - API endpoints and features

### **📖 Additional Reading by Role**

**Frontend Developers:**
- [Development Setup](development/LOCAL_DEVELOPMENT.md)
- [Cross-Platform Setup](development/CROSS_PLATFORM_SETUP.md)
- [Troubleshooting](troubleshooting/bugs.md)

**Backend Developers:**
- [Development Setup](development/LOCAL_DEVELOPMENT.md)
- [Deployment Guides](deployment/)
- [Release Notes](release-notes/CHANGELOG.md)

**DevOps/Deployment:**
- [Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)
- [Deployment Guide](deployment/DEPLOYMENT.md)
- [Production Fixes](deployment/VERCEL_FIX_COMPLETE.md)

**Project Managers:**
- [Release Notes](release-notes/CHANGELOG.md)
- [Feature Guides](guides/)
- [Development Status](development/todo.md)

## 📁 **Documentation Categories**

### **🔧 Development**
Essential guides for setting up and working with the codebase locally.

| Document | Description | Audience |
|----------|-------------|----------|
| [Local Development](development/LOCAL_DEVELOPMENT.md) | Complete local setup guide | All developers |
| [Cross-Platform Setup](development/CROSS_PLATFORM_SETUP.md) | Multi-OS compatibility guide | All developers |
| [Todo List](development/todo.md) | Current development tasks | Developers, PMs |

### **🚀 Deployment**
Production deployment and infrastructure guides.

| Document | Description | Audience |
|----------|-------------|----------|
| [Deployment Guide](deployment/DEPLOYMENT.md) | General deployment instructions | DevOps, Backend |
| [Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md) | Vercel-specific deployment | DevOps |
| [Vercel Fixes](deployment/VERCEL_FIX_COMPLETE.md) | Production issue resolutions | DevOps |

### **📖 Guides**
Feature-specific tutorials and how-to guides.

| Document | Description | Audience |
|----------|-------------|----------|
| [Login Fixes](guides/LOGIN_FIXES_GUIDE.md) | Authentication troubleshooting | Developers |
| [Help Center](guides/HELP_CENTER_ORGANIZATION.md) | Help system organization | Content, Support |

### **🔐 Environment Configuration**
Environment setup and configuration management.

| Document | Description | Audience |
|----------|-------------|----------|
| [Environment Guide](../env/README.md) | Complete environment setup guide | All developers |
| [Environment Examples](../env/) | Template files and examples | All developers |

### **🔍 Troubleshooting**
Problem-solving and debugging resources.

| Document | Description | Audience |
|----------|-------------|----------|
| [Bug Reports](troubleshooting/bugs.md) | Known issues and fixes | All developers |

### **📋 Release Notes**
Version history, changes, and release information.

| Document | Description | Audience |
|----------|-------------|----------|
| [Changelog](release-notes/CHANGELOG.md) | Version history overview | Everyone |
| [Release Notes](release-notes/) | Detailed version information | Developers, PMs |

## 🎯 **Quick Reference**

### **Most Important Documents**
1. **[Local Development Setup](development/LOCAL_DEVELOPMENT.md)** - Start here for local dev
2. **[Cross-Platform Setup](development/CROSS_PLATFORM_SETUP.md)** - Multi-OS support
3. **[Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)** - Production deployment

### **Common Tasks**
- **Setting up locally**: [Local Development](development/LOCAL_DEVELOPMENT.md)
- **Windows setup**: [Cross-Platform Setup](development/CROSS_PLATFORM_SETUP.md)
- **Fixing login issues**: [Login Fixes Guide](guides/LOGIN_FIXES_GUIDE.md)
- **Deploying to production**: [Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)
- **Finding known bugs**: [Bug Reports](troubleshooting/bugs.md)

### **Development Commands**
```bash
# Quick start (all platforms)
npm run dev:backend

# Cross-platform PostgreSQL setup
npm run postgres:setup

# Docker PostgreSQL
npm run postgres:docker

# Create environment template
npm run env:create
```

## 🤝 **Contributing to Documentation**

When adding new documentation:

1. **Choose the right category** (development, deployment, guides, etc.)
2. **Follow the naming convention** (lowercase with dashes)
3. **Update this README.md** to include the new document
4. **Use clear headings and examples**
5. **Include audience information**

### **Documentation Standards**
- Use emoji headers for visual organization 📚
- Include code examples where relevant
- Specify target audience for each document
- Keep a clear table of contents
- Use consistent formatting

## 🔗 **External Resources**

- **[Prisma Documentation](https://www.prisma.io/docs/)**
- **[Vite Documentation](https://vitejs.dev/)**
- **[Vercel Documentation](https://vercel.com/docs)**
- **[PostgreSQL Documentation](https://www.postgresql.org/docs/)**

## 📞 **Support**

If you can't find what you're looking for:

1. **Check the [troubleshooting section](troubleshooting/)**
2. **Search through [release notes](release-notes/)**
3. **Look at [known bugs](troubleshooting/bugs.md)**
4. **Contact the development team**

---

**Happy coding! 🚀**
