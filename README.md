# DiamondPrice Compass

Navigate the diamond market with confidence. A consumer-facing platform that provides instant, transparent pricing and valuation for lab-grown diamonds, helping engagement ring shoppers make informed decisions.

## 🚀 Features

### Core Features
- **Instant Valuation Report**: Upload diamond photos or enter specifications to get real-time market valuations
- **Overpriced Listing Alerts**: Automatically detect diamonds priced above fair market value
- **AI-Powered Negotiation Scripts**: Get personalized negotiation strategies and checklists
- **Ethical Sourcing Verification**: Verify diamond origin and traceability
- **Market Analysis**: Compare prices against current market data
- **IPFS Storage**: Secure, decentralized storage for diamond images and certificates

### Technical Features
- **Real-time AI Analysis**: OpenAI GPT-4 Vision for image analysis and negotiation scripts
- **Stripe Integration**: Secure payment processing for subscriptions and single reports
- **IPFS Storage**: Pinata integration for decentralized file storage
- **Responsive Design**: Modern UI with Tailwind CSS and custom design system
- **Progressive Enhancement**: Works with or without API keys (fallback to mock data)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **AI/ML**: OpenAI GPT-4 Vision, GPT-3.5 Turbo
- **Payments**: Stripe Checkout & Subscriptions
- **Storage**: Pinata IPFS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-1381.git
   cd this-is-a-1381
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # Required for AI features
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Required for payments
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   
   # Required for image storage
   VITE_PINATA_API_KEY=your_pinata_api_key_here
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
   
   # Optional - API endpoint (defaults to localhost:3001)
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env` as `VITE_OPENAI_API_KEY`

#### Stripe Configuration
1. Visit [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your publishable key (starts with `pk_`)
3. Add to `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`

#### Pinata IPFS Setup
1. Visit [Pinata](https://pinata.cloud/)
2. Create account and get API keys
3. Add both keys to `.env`:
   - `VITE_PINATA_API_KEY`
   - `VITE_PINATA_SECRET_KEY`

### Fallback Mode
The app works without API keys by using mock data:
- Mock diamond valuations
- Simulated AI-generated negotiation scripts
- Demo payment flows
- Local file handling instead of IPFS

## 🏗️ Architecture

### Services Layer
- **`apiService`**: Base HTTP client with authentication
- **`openaiService`**: AI-powered image analysis and text generation
- **`stripeService`**: Payment processing and subscription management
- **`pinataService`**: IPFS file storage and retrieval
- **`diamondService`**: Core diamond valuation and market analysis
- **`authService`**: User authentication and profile management

### Components
- **`AppShell`**: Main layout with navigation
- **`UserForm`**: Multi-variant form for diamond input
- **`ValuationResults`**: Comprehensive valuation display
- **`NegotiationScript`**: AI-generated negotiation content
- **`DiamondCard`**: Diamond specification display
- **`AlertBanner`**: Overpriced listing warnings
- **`MarketChart`**: Price trend visualization

### Pages
- **`HomePage`**: Landing page with features overview
- **`ValuationPage`**: Multi-step diamond valuation flow
- **`PricingPage`**: Subscription plans and payment

## 💰 Business Model

### Pricing Plans
- **Single Report**: $29 per diamond valuation
- **Unlimited Access**: $99/month subscription

### Features by Plan
- Single Report: Basic valuation, market analysis, negotiation tips
- Unlimited: All features + AI scripts, ethical verification, priority support

## 🎨 Design System

### Colors
- **Primary**: `hsl(260, 60%, 50%)` - Deep purple
- **Accent**: `hsl(190, 70%, 55%)` - Bright cyan
- **Background**: `hsl(220, 15%, 96%)` - Light gray
- **Surface**: `hsl(220, 15%, 100%)` - White

### Typography
- **Display**: 5xl, bold, tight tracking
- **Heading 1**: 4xl, bold
- **Heading 2**: 3xl, semibold
- **Body**: Base size, 7 leading

### Components
- Glass morphism effects with backdrop blur
- Smooth animations with custom easing
- Responsive grid system (12-column)
- Consistent spacing scale (8px base)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Docker Deployment
```bash
# Build image
docker build -t diamond-price-compass .

# Run container
docker run -p 3000:80 diamond-price-compass
```

## 🧪 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── services/           # API and business logic
├── context/            # React context providers
├── assets/             # Static assets
└── styles/             # Global styles
```

### Key Files
- `src/services/diamondService.js` - Core valuation logic
- `src/services/openaiService.js` - AI integration
- `src/services/stripeService.js` - Payment processing
- `src/components/UserForm.jsx` - Multi-variant input form
- `src/pages/ValuationPage.jsx` - Main valuation flow

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## 📊 Features Implementation Status

### ✅ Completed
- [x] Core UI components and design system
- [x] Multi-step valuation flow
- [x] OpenAI integration for AI analysis
- [x] Stripe payment integration
- [x] Pinata IPFS storage
- [x] Diamond valuation algorithms
- [x] Negotiation script generation
- [x] Responsive design
- [x] Error handling and fallbacks
- [x] Mock data for development

### 🚧 Backend Requirements (Separate Implementation)
- [ ] User authentication API
- [ ] Diamond market data API
- [ ] Subscription management webhooks
- [ ] Database for storing valuations
- [ ] Email notifications
- [ ] Admin dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced market analytics
- [ ] Diamond comparison tools
- [ ] Jeweler directory integration
- [ ] Blockchain certificate verification
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Price alerts and notifications
- [ ] Social sharing features
- [ ] Expert consultation booking
