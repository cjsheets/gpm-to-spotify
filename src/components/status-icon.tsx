import React, { useState, useEffect } from 'react';
import { Icon as ZeitUiIcon, Trash2 } from '@zeit-ui/react-icons';
import { Spinner } from '@zeit-ui/react';
import styles from '../styles/components-status-icon.module.scss';

interface Props {
  Icon: ZeitUiIcon;
  onRemove?: () => void;
  color?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function StatusIcon({ Icon, color, isLoading, disabled, onRemove }: Props) {
  const [isMouseOver, setMouseOver] = useState(false);

  return isLoading ? (
    <Spinner />
  ) : (
    <button
      className={styles.button}
      onMouseEnter={() => !disabled && setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={isMouseOver ? onRemove : undefined}
    >
      {isMouseOver ? <Trash2 color={color} /> : <Icon color={color} />}
    </button>
  );
}
