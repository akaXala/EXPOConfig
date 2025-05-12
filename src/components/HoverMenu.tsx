import * as React from 'react';
import { Button, Box, Popper, Paper, MenuList, MenuItem, ClickAwayListener } from '@mui/material';

// DOM de Next.js
import Link from 'next/link';

// Para personalizar el componente desde el componente padre
interface MenuItemData {
  text: string;
  url: string;
}

interface HoverMenuProps {
  triggerText: string;
  menuItems: MenuItemData[];
}

export default function HoverMenu({ triggerText, menuItems }: HoverMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const hoverTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box textAlign="center">
      <p
        aria-describedby="hover-popper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      >
        {triggerText}
      </p>

      <Popper
        id="hover-popper"
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <MenuList autoFocusItem={open}>
              {menuItems.map((itemData, index) => (
                <Link
                  key={index}
                  href={itemData.url}
                >
                  <MenuItem
                    key={index}
                  >
                      {itemData.text}
                  </MenuItem>
                </Link>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
