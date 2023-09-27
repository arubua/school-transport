import { useState } from "react"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
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
import { Button } from "../../app/components/ui/button"
import { Checkbox } from "../../app/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../app/components/ui/dropdown-menu"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Icon } from "../../app/components/ui/icon"
import { Input } from "../../app/components/ui/input"
import { Label } from "../../app/components/ui/label"
import { StatusButton } from "../../app/components/ui/status-button"
import { Textarea } from "../../app/components/ui/textarea"

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
