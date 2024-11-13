// settings.tsx
type SliderSettings = {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  pauseOnHover: boolean;
  arrows: boolean;
  fade: boolean;
  cssEase: string;
  adaptiveHeight: boolean;
  beforeChange: (current: number, next: number) => void;
  afterChange: (current: number) => void;
};

export const getSliderSettings = (
  setCurrentMovieIndex: (index: number) => void,
  setShowDetails: (show: boolean) => void
): SliderSettings => ({
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1.9,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  arrows: false,
  fade: true,
  cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
  adaptiveHeight: true,
  beforeChange: (_, next) => {
    setCurrentMovieIndex(next);
    setShowDetails(false);
  },
  afterChange: (current) => {
    console.log("Slide changed to:", current);
  },
});
