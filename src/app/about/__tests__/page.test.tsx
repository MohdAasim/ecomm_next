import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutUs, { metadata } from '../page';

describe('About Us Page', () => {
  beforeEach(() => {
    render(<AboutUs />);
  });

  describe('Page Structure', () => {
    it('should render the main container', () => {
      const container = screen.getByText('About Us').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should have proper page title', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('About Us');
    });
  });

  describe('Content Display', () => {
    it('should display welcome message', () => {
      const welcomeText = screen.getByText(/Welcome to Ecommerce Client/i);
      expect(welcomeText).toBeInTheDocument();
      expect(welcomeText).toHaveTextContent(
        'Welcome to Ecommerce Client — your trusted online store for quality products at great prices.'
      );
    });

    it('should display mission statement', () => {
      const missionText = screen.getByText(/Our mission is to deliver/i);
      expect(missionText).toBeInTheDocument();
      expect(missionText).toHaveTextContent(
        'Our mission is to deliver the best online shopping experience by offering top-notch customer service, fast shipping, and a carefully curated product range.'
      );
    });

    it('should display team description', () => {
      const teamText = screen.getByText(/We are a small team/i);
      expect(teamText).toBeInTheDocument();
      expect(teamText).toHaveTextContent(
        'We are a small team of passionate professionals committed to making e-commerce better for everyone. Thank you for choosing us!'
      );
    });

    it('should display all three content paragraphs', () => {
      const paragraphs = screen.getAllByText(/.*/, { selector: 'p' });
      expect(paragraphs).toHaveLength(3);
    });
  });

  describe('Styling and Layout', () => {
    it('should apply container styles', () => {
      const container = screen.getByText('About Us').closest('div');
      expect(container).toHaveStyle({
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('About Us');
    });

    it('should have readable text content', () => {
      const allText = screen.getByText('About Us').closest('div')?.textContent;
      expect(allText).toBeTruthy();
      expect(allText!.length).toBeGreaterThan(100);
    });
  });

  describe('Component Export', () => {
    it('should export the component as default', () => {
      expect(AboutUs).toBeDefined();
      expect(typeof AboutUs).toBe('function');
    });

    it('should render without crashing', () => {
      expect(() => render(<AboutUs />)).not.toThrow();
    });
  });
});

describe('About Us Page Metadata', () => {
  it('should have correct title', () => {
    expect(metadata.title).toBe('About Us');
  });

  it('should have meaningful description', () => {
    expect(metadata.description).toBe(
      'Learn more about our mission and commitment to quality'
    );
  });

  it('should have description with appropriate length for SEO', () => {
    const description = metadata.description as string;
    expect(description.length).toBeGreaterThan(30);
    expect(description.length).toBeLessThan(160);
  });
});
