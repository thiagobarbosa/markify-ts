import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'

export const Loader = ({ size = '20', speed = '1.75', color = 'white' }) =>
  <Quantum
    size={size}
    speed={speed}
    color={color}
  />
