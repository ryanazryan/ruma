import { IsBoolean } from 'class-validator';

export class UpdateCartSelectionDto {
  @IsBoolean()
  isSelected!: boolean;
}