import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ProductSpec } from '@/types'

interface SpecsTableProps {
  specs: ProductSpec[]
}

export function SpecsTable({ specs }: SpecsTableProps) {
  if (specs.length === 0) return null

  return (
    <div className="rounded-lg border">
      <Table>
        <TableBody>
          {specs.map((spec, index) => (
            <TableRow key={index}>
              <TableCell className="text-muted-foreground w-1/3 font-medium">
                {spec.key}
              </TableCell>
              <TableCell>{spec.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
