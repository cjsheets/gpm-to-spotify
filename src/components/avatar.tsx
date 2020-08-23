import React, { useContext } from 'react';
import styles from '../styles/components-avatar.module.scss';
import { userStore } from '../stores/user-store';
import { Avatar as ZeitUiAvatar, Link, Popover } from '@zeit-ui/react';
import { withAuthentication } from '../utility/with-authentication';

export default withAuthentication(function Avatar() {
  const userContext = useContext(userStore);
  const { store } = userContext;

  if (!store.user) {
    return null;
  }

  const url = store?.user?.images && store.user.images[0]?.url;

  const SignOutMenu = () => {
    const clearStorage = () => {
      window.sessionStorage.clear();
    };

    return (
      <div style={{ padding: '0 10px', width: 100 }}>
        <Link onClick={clearStorage}>Sign out</Link>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Popover content={SignOutMenu} trigger="hover">
        {url ? (
          <ZeitUiAvatar src={url} size={50} />
        ) : (
          <ZeitUiAvatar text={store.user.display_name} size={50} />
        )}
      </Popover>
    </div>
  );
});
