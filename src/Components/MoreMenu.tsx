interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  onAboutClick?: () => void;
  onGiveClick?: () => void;
  onConnectClick?: () => void;
}

export default function MoreMenu({ open, onClose, onAboutClick, onConnectClick }: MoreMenuProps) {
  const items = [
    { label: 'About', onClick: onAboutClick },
    // Hidden for now: { label: 'Donate', onClick: onGiveClick },
    { label: 'Connect', onClick: onConnectClick },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[150] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-slate-900 rounded-t-2xl z-[160] transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="px-6 pt-8 pb-6 flex flex-col">
          {items.map((item, i) => (
            <div key={item.label}>
              <div
                className="py-4 cursor-pointer"
                onClick={() => { onClose(); item.onClick?.(); }}
              >
                <span className="text-white font-medium text-lg">{item.label}</span>
              </div>
              {i < items.length - 1 && <div className="border-t border-gray-700" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
