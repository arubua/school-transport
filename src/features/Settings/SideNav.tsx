import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "../../utils/misc"
import { Button, buttonVariants } from "../../components/ui/button"



interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
      href: string
      title: string
    }[]
  }
  
  export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = useLocation()

    console.log({pathname})
  
    return (
      <nav
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <a

            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname.pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </a>
        ))}
      </nav>
    )
  }