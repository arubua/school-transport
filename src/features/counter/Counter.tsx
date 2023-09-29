import { useState } from "react"

import { useAppSelector, useAppDispatch } from "../../hooks/hooks"
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
  decrementByAmount,
} from "./counterSlice"
import styles from "./Counter.module.css"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Icon } from "../../components/ui/icon"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { StatusButton } from "../../components/ui/status-button"
import { Textarea } from "../../components/ui/textarea"

export function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState("2")

  const incrementValue = Number(amount) || 0
  const decrementValue = Number(amount) || 0

  return (
    <div>
      <div className={styles.row}>
        <Button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </Button>
        <span className={styles.value}>{count}</span>
        <Button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </Button>
      </div>
      <div className={styles.row}>
        <Button
          onClick={() => dispatch(decrementByAmount(decrementValue))}
        variant='default' size='sm'>
          Subtract Amount
        </Button>
        <Input
          className="w-14"
          // aria-label="Set amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </Button>
        <Button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </Button>
        <Button
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </Button>
      </div>
    </div>
  )
}
