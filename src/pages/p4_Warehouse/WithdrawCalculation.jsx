import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function WithdrawCalculation() {
  const [isPayDebt, setIsPayDebt] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/warehouse">Gudang Saya</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Alokasi Penarikan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="max-w-[400px] min-w-[400px]">
        <CardHeader>
          <CardTitle>Alokasi Penarikan</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field className="flex flex-row items-center justify-center">
                <FieldLabel>Total Penarikan</FieldLabel>
                <Input />
              </Field>
              <Field className="flex flex-row items-center justify-center">
                <Switch
                  checked={isPayDebt}
                  onCheckedChange={(v) => {
                    setIsPayDebt(v);
                  }}
                />
                <FieldLabel>Bayar Hutang Barang</FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
