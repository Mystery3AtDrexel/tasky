import { colors } from "../../lib/constants";

type ColorPickerProps = {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

function ColorPicker({ color, setColor }: ColorPickerProps) {
  return(
    <select
      className="capitalize rounded-xl border p-2 outline-none w-fit"
      defaultValue={color}
      onChange={(e) => (setColor(e.target.value))}
    >
      {colors.map((color) => (
        <option 
          className="capitalize"
          value={color}
          key={color}
        >
          {color}
        </option>
      ))}
    </select>
  );
};

export default ColorPicker;