import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-bold text-muted-foreground leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-primary/10">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg transition-colors">
            Go Home
          </Link>
          <Link to="/search" className="inline-flex items-center justify-center px-6 py-3 bg-muted hover:bg-accent text-foreground font-medium rounded-lg transition-colors">
            Search Products
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Need help?{" "}
          <Link to="/contact-us" className="text-primary hover:text-primary underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NotFound;
