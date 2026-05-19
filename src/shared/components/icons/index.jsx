import {
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiShield,
  FiSend,
  FiCreditCard,
  FiShoppingBag,
  FiStar,
  FiDatabase,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";

export const dashboardIcons = {
  audit: FiBarChart2,
  requests: FiUsers,
  deposits: FiDollarSign,
  reverse: FiShield,
  transfers: FiSend,
  payments: FiCreditCard,
  catalog: FiShoppingBag,
  favorites: FiStar,
  totalAccounts: FiDatabase,
  activeAccounts: FiCheckCircle,
  blockedAccounts: FiLock,
  totalBalance: FiDollarSign,
};

export const renderDashboardIcon = (iconKey, className = "w-8 h-8") => {
  const IconComponent = dashboardIcons[iconKey];

  if (!IconComponent) return null;

  return <IconComponent className={className} aria-hidden="true" />;
};