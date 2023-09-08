import { RadioGroup, RadioGroupProps, RadioProps, VisuallyHidden, cn, useRadio } from '@nextui-org/react'
import { Colour } from '@prisma/client'
import React, { } from 'react'
import { bgGradientFromColour } from '../lib/colours'

const readableColourNames: { [key in Colour]: string } = {
  RED: "Red",
  ORANGE: "Orange",
  YELLOW: "Yellow",
  GREEN: "Green",
  BLUE: "Blue",
  PURPLE: "Purple"
}

const ColourRadioButton = (props: RadioProps & { colour: Colour }) => {
  const {
    Component,
    children,
    description,
    isSelected,
    getBaseProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex flex-col items-center justify-center hover:bg-content2 data-[selected=true]:bg-content2",
        "cursor-pointer rounded-lg",
        "w-fit p-1",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div className={cn(
        `h-[72px] w-[72px] bg-gradient-to-br ${bgGradientFromColour[props.colour]}`,
        "rounded-md border-2 border-default",
        isSelected ? "border-primary" : ""
      )
      } />
      <div {...getLabelWrapperProps()} className="m-0">
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">{description}</span>
        )}
      </div>
    </Component>
  );
};

export default function ColourRadioGroup(props: RadioGroupProps) {

  return (
    <RadioGroup label="Colour" classNames={{ label: "text-foreground" }} {...props}>
      <div className="flex flex-row w-fit gap-4 flex-wrap">
        {Object.values(Colour).map(colour =>
          <ColourRadioButton name={props.name} key={colour} value={colour} colour={colour}>{readableColourNames[colour]}</ColourRadioButton>
        )}
      </div>
    </RadioGroup>
  )
}
