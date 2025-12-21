import { useEffect, useState } from 'react';

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand(); // Open full height
      setUser(tg.initDataUnsafe?.user || null);
      
      // Align theme with app
      // tg.setHeaderColor('#0a0a0a'); // Matches --bg-primary
    }
  }, []);

  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  return {
    onClose,
    onToggleButton,
    tg,
    user,
  };
}
