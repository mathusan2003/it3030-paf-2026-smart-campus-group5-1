import React from 'react';

const Svg = ({ children, className = 'h-5 w-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const DashboardIcon = (props) => (
  <Svg {...props}>
    <path d="M4 13h7V4H4z" />
    <path d="M13 20h7V11h-7z" />
    <path d="M13 4h7v5h-7z" />
    <path d="M4 16h7v4H4z" />
  </Svg>
);

export const BookingIcon = (props) => (
  <Svg {...props}>
    <path d="M5 5h14v14H5z" />
    <path d="M8 5V3" />
    <path d="M16 5V3" />
    <path d="M5 9h14" />
    <path d="M8 13h8" />
  </Svg>
);

export const ConciergeIcon = (props) => (
  <Svg {...props}>
    <path d="M6 12a6 6 0 0 1 12 0" />
    <path d="M4 12h16" />
    <path d="M7 16h10" />
    <path d="M9 7a3 3 0 1 1 6 0" />
  </Svg>
);

export const GuestsIcon = (props) => (
  <Svg {...props}>
    <path d="M16 20a4 4 0 0 0-8 0" />
    <circle cx="12" cy="8" r="4" />
    <path d="M18 10a3 3 0 1 0-3-3" />
  </Svg>
);

export const AnalyticsIcon = (props) => (
  <Svg {...props}>
    <path d="M5 19V5" />
    <path d="M5 19h14" />
    <path d="M8 14l3-3 3 2 4-6" />
    <path d="M18 7v3h-3" />
  </Svg>
);

export const SettingsIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6.1a7 7 0 0 0-1.7 1L5 7.7l-2 3.4L5 12a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1L9.5 21h5l.5-3.1a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z" />
  </Svg>
);

export const BellIcon = (props) => (
  <Svg {...props}>
    <path d="M6 17h12l-1.5-2.2V11a4.5 4.5 0 0 0-9 0v3.8L6 17z" />
    <path d="M10 17a2 2 0 0 0 4 0" />
  </Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16.2 16.2 21 21" />
  </Svg>
);

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);

export const TrendUpIcon = (props) => (
  <Svg {...props}>
    <path d="M4 16l5-5 4 4 7-8" />
    <path d="M16 7h4v4" />
  </Svg>
);

export const RevenueIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3v18" />
    <path d="M17 7.5a4.5 4.5 0 0 0-4-2h-2a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-2a4.5 4.5 0 0 1-4-2" />
  </Svg>
);

export const OccupancyIcon = (props) => (
  <Svg {...props}>
    <path d="M5 20V8l7-4 7 4v12" />
    <path d="M9 20v-7h6v7" />
  </Svg>
);

export const PendingIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const XIcon = (props) => (
  <Svg {...props}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Svg>
);

export const DotsIcon = (props) => (
  <Svg {...props}>
    <path d="M6 12h.01" />
    <path d="M12 12h.01" />
    <path d="M18 12h.01" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Svg>
);

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <path d="M6 4h12v16H6z" />
    <path d="M6 8h12" />
    <path d="M9 2v4" />
    <path d="M15 2v4" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </Svg>
);
