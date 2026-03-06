import type { ComponentProps, ReactNode } from "react"; 
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base:'rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer',

  variants:{
    variant: {
      primary: 'bg-sky-400 text-zinc-950 hover:bg-sky-500',
      secondary: 'bg-zinc-800 text-zinc-200  hover:bg-zinc-900',
      terciary: 'bg-zinc-950 text-rose-600 hover:text-rose-400',
      quaternary: 'bg-zinc-950 text-sky-400 hover:text-sky-200'
    },

    size: {
      default: 'py-2',
      full: 'w-full h-11',
      fit: 'flex w-fit h-11 py-2 items-center justify-center whitespace-nowrap',
    }
  }, 

  defaultVariants:{
    variant: 'primary',
    size: 'default'
  }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants>{ 
  children: ReactNode
}

export function Button({ children, variant, size, ...props } : ButtonProps){ 
  return (
    <button {...props} className={buttonVariants({variant, size})}> 
      {children}
    </button>
  )
}