import * as React from 'react';
import { Box, Popper, Paper, MenuList, MenuItem, ClickAwayListener, Typography } from '@mui/material';

// DOM de Next.js
import Link from 'next/link';

// Iconos MUI
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="span"
          aria-describedby="hover-popper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            cursor: 'pointer',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            paddingBottom: '5px',

            // Estilo del pseudo-elemento (el subrayado)
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              transform: 'scaleX(0)',
              height: '2px',
              bottom: 0,
              left: 0,
              backgroundColor: 'currentColor', // El subrayado tomará el color del texto
              transformOrigin: 'center',
              transition: 'transform 0.3s ease-out',
            },

            // --- INICIO DE LA MODIFICACIÓN ---
            // Estilos al pasar el cursor sobre el texto
            '&:hover::after': {
              transform: 'scaleX(1)', // Se expande a su tamaño completo
              // Se ha eliminado la línea de 'boxShadow'
            },
            // --- FIN DE LA MODIFICACIÓN ---
          }}
        >
          {triggerText}
          <KeyboardArrowDownIcon sx={{ marginLeft: '4px' }}/>
        </Typography>
      </Box>
      <Popper
        id="hover-popper"
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        sx={{ zIndex: 1 }}
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
                  passHref
                >
                  <MenuItem>
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