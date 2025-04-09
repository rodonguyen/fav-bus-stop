import { useTheme } from '../context/ThemeContext';

type AdaptiveStylesType = {
  [key: string]: string;
};

/** Returns an object of adaptive styles based on the current theme. It doesn't refresh while editing but it does the job. */
const AdaptiveStyles = (): AdaptiveStylesType => {
  const { isDarkTheme } = useTheme();

  const adaptiveStyles = {
    'bg-base-adaptive-100': 'bg-base-200/50',
  };

  if (isDarkTheme) {
    adaptiveStyles['bg-base-adaptive-100'] = 'bg-base-300';
  }

  return adaptiveStyles;
};

export default AdaptiveStyles;
