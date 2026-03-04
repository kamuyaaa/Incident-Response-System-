import Modal from './Modal'

const NUMBERS = [
  { label: 'Police', numbers: '999 or 112' },
  { label: 'Kenya Red Cross Ambulance', numbers: '1199' },
  { label: 'St John Ambulance', numbers: '020 221 0000' },
  { label: 'Fire & Rescue', numbers: '999 or 112' },
  { label: 'Nairobi Fire Brigade', numbers: '020 222 2181 or 020 234 4599' },
]

interface EmergencyNumbersModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmergencyNumbersModal({ isOpen, onClose }: EmergencyNumbersModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emergency numbers">
      <div className="space-y-1">
        {NUMBERS.map((item, i) => (
          <div
            key={item.label}
            className={`flex justify-between items-center gap-4 py-3.5 ${i < NUMBERS.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <span className="text-black font-medium">{item.label}</span>
            <span className="text-[#d92323] font-semibold shrink-0">{item.numbers}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}
