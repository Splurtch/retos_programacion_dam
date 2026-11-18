using System;
using System.Timers;

class Program2
{
    static void Main(string[] args)
    {// Definir constantes para los tipos de IVA    
    const double IVA_GENERAL = 0.21;
    const double IVA_REDUCIDO = 0.10;
    const double IVA_SUPER_REDUCIDO = 0.04;
    double precioSinIVA;    
    string usuario = "Usuario1"; 
    string contrasena = "1234";     
    string usuarioIngresado;
    string contrasenaIngresada;
    string tipoIVA;
    double precioConIVA = 0;
    int mesesFinanciacion;
    double interesNominalAnual;
    double interesMensual;
    double cuotaMensual;
    
    do // Bucle para solicitar usuario y contraseña
    {Console.WriteLine("Ingrese su usuario: ");
    usuarioIngresado = Console.ReadLine();
    Console.WriteLine("Ingrese su contraseña: ");
    contrasenaIngresada = Console.ReadLine();
    if (usuarioIngresado == usuario && contrasenaIngresada == contrasena) //bucle para verificar si el usuario y la contraseña son correctos
    {
        Console.WriteLine("Usuario y contraseña correctos.");
        break; //salir del bucle si el usuario y la contraseña son correctos
    }
    else //comprobar si credenciales son incorrectas y preguntar si quiere intentarlo de nuevo
    {
        if (usuarioIngresado != usuario)
        {
            Console.WriteLine("Usuario incorrecto. Intente nuevamente.");
        }
        if (contrasenaIngresada != contrasena)
        {
            Console.WriteLine("Contraseña incorrecta. Intente nuevamente.");
        }
        string respuesta;
        do // Bucle para solicitar al usuario si quiere intentarlo de nuevo
        {
            Console.WriteLine("¿Desea intentarlo de nuevo? (s/n)");
            respuesta = Console.ReadLine(); 
            if (respuesta != "s" && respuesta != "S" && 
                respuesta != "n" && respuesta != "N") //comprobar si la respuesta es válida
            {
                Console.WriteLine("Respuesta incorrecta. Debe ingresar 's' o 'n'.");
            }
        } while (respuesta != "s" && respuesta != "S" && 
                 respuesta != "n" && respuesta != "N"); //salir del bucle si la respuesta es válida

        if (respuesta == "n" || respuesta == "N") //si el usuario no quiere intentarlo de nuevo, salir del programa
        {
            Console.WriteLine("Saliendo del programa.");
            return; //salir del programa
        }
    }
    } while (true);

    do// Bucle para solicitar el precio sin IVA
    {
        Console.WriteLine("Ingrese el precio sin IVA: ");
        try
        {
            precioSinIVA = Convert.ToDouble(Console.ReadLine());
            if (precioSinIVA > 0) //comprobar si el precio ingresado es mayor a cero
            {
                break; //salir del bucle si el valor ingresado es válido
            }
            Console.WriteLine("Error: El precio debe ser mayor a cero.");
        }
        
        catch (FormatException) //manejo de excepciones para evitar errores al ingresar un valor no numérico
        {
            Console.WriteLine("Error: Debe ingresar un número válido para el precio sin IVA.");
        }
    } while (true);
   
   do // Bucle para solicitar el tipo de IVA y calcular el precio con IVA
   {
        Console.WriteLine("Ingrese el tipo de IVA (1. general, 2. reducido, 3. superreducido): ");
        tipoIVA = Console.ReadLine();
        switch (tipoIVA) //bucle para calcular el precio con IVA según el tipo de IVA ingresado
    {
        case "1":
            precioConIVA = precioSinIVA * (1 + IVA_GENERAL);
            Console.WriteLine("El precio con IVA es: " + precioConIVA.ToString("F2"));
            break;
        case "2":
            precioConIVA = precioSinIVA * (1 + IVA_REDUCIDO);
            Console.WriteLine("El precio con IVA es: " + precioConIVA.ToString("F2"));
            break;
        case "3":
            precioConIVA = precioSinIVA * (1 + IVA_SUPER_REDUCIDO);
            Console.WriteLine("El precio con IVA es: " + precioConIVA.ToString("F2"));
            break;
        default:
            Console.WriteLine("Tipo de IVA incorrecto.");
            break;}

    } while (tipoIVA != "1" && tipoIVA != "2" && tipoIVA != "3"); //salir del bucle si el tipo de IVA ingresado es válido
    
    if (precioConIVA >= 500) //comprobar si el precio con IVA es mayor a 500 para poder financiar
    {
        string respuestaFinanciacion;
        do // Bucle para solicitar si el usuario desea financiar
        {
            Console.WriteLine("El proceso con IVA es mayor a 500, ¿Desea financiar el precio con IVA? (s/n)");
            respuestaFinanciacion = Console.ReadLine();
            if (respuestaFinanciacion != "s" && respuestaFinanciacion != "S" && 
                respuestaFinanciacion != "n" && respuestaFinanciacion != "N")   //comprobar si la respuesta es válida
            {
                Console.WriteLine("Respuesta incorrecta. Debe ingresar 's' o 'n'.");
            }
        } while (respuestaFinanciacion != "s" && respuestaFinanciacion != "S" && 
                 respuestaFinanciacion != "n" && respuestaFinanciacion != "N"); //salir del bucle si la respuesta es válida
        if (respuestaFinanciacion == "s" || respuestaFinanciacion == "S") //comprobar si el usuario desea financiar
        {
            Console.WriteLine("El precio con IVA se financiará.");
            do // Bucle para solicitar el número de meses de financiación y el interés nominal anual
            {
                try
                {
                    Console.WriteLine("En cuantos meses desea financiarlo? (3, 6, 12)");
                    mesesFinanciacion = Convert.ToInt32(Console.ReadLine());
                    Console.WriteLine("¿Cuál es el interés nominal anual %?"); 
                    interesNominalAnual = Convert.ToDouble(Console.ReadLine());
                }
                catch (FormatException) //manejo de excepciones para evitar errores al ingresar un valor no numérico
                {
                    Console.WriteLine("Error: Debe ingresar un número válido para los meses de financiación y el interés nominal anual.");
                    continue; //volver al inicio del bucle si hay un error en la entrada
                }
                catch (OverflowException) //manejo de excepciones para evitar errores al ingresar un valor demasiado grande
                {
                    Console.WriteLine("Error: El número ingresado es demasiado grande.");
                    continue; //volver al inicio del bucle si hay un error en la entrada
                }    
                    if ((mesesFinanciacion == 3 || 
                         mesesFinanciacion == 6 || 
                         mesesFinanciacion == 12) &&
                         interesNominalAnual >= 0 &&
                         double.IsFinite(interesNominalAnual)) //comprobar si el número de meses ingresado es válido y el interés nominal anual es mayor o igual a 0
                    {
                interesMensual = interesNominalAnual / 12 / 100; //calcular el interés mensual
                if (interesMensual == 0) //comprobar si el interés mensual es cero para evitar división por cero
                {
                    cuotaMensual = precioConIVA / mesesFinanciacion; //calcular la cuota mensual si el interés es cero
                }
                else
                {
                    cuotaMensual = precioConIVA * (interesMensual * Math.Pow(1 + interesMensual, mesesFinanciacion)) / (Math.Pow(1 + interesMensual, mesesFinanciacion) - 1); //calcular la cuota mensual segun la fórmula de amortización francesa
                }        
                Console.WriteLine("La cuota mensual a pagar es: " + cuotaMensual.ToString("F2"));
                double saldoPendiente = precioConIVA; //inicializar el saldo pendiente con el precio con IVA
                int mes = 1; //inicializar el mes en 1
                double totalIntereses = 0; //inicializar el total de intereses en 0
                Console.WriteLine("Mes\tCuota\tInt.\tAmort.\tSaldo pendiente");
                while (mes <= mesesFinanciacion) //bucle para calcular el detalle de la financiación mes a mes
                {
                    double intereses = saldoPendiente * interesMensual; //calcular los intereses del mes
                    double amortizacion = cuotaMensual - intereses; //calcular la amortización del mes
                    double cuotaActual = cuotaMensual; //inicializar la cuota actual con la cuota mensual
                    if (mes == mesesFinanciacion) //comprobar si es el último mes
                    {
                        amortizacion = saldoPendiente; //si es el último mes, la amortización será el saldo pendiente
                        cuotaActual = amortizacion + intereses; //la cuota actual será la suma de la amortización y los intereses
                    }
                    saldoPendiente -= amortizacion; //actualizar el saldo pendiente
                    totalIntereses += intereses; //actualizar el total de intereses
                    Console.WriteLine("{0}\t{1}\t{2}\t{3}\t{4}", mes, cuotaActual.ToString("F2"), intereses.ToString("F2"), amortizacion.ToString("F2"), saldoPendiente.ToString("F2"));
                    mes++; //incrementar el mes
                }
                Console.WriteLine("Capital financiado: " + precioConIVA.ToString("F2"));
                Console.WriteLine("Total intereses: " + totalIntereses.ToString("F2"));
                Console.WriteLine("Total pagado: " + (precioConIVA + totalIntereses).ToString("F2")); 
                break; //salir del bucle si el número de meses ingresado es válido
            }
            else
            {
                Console.WriteLine("Número de meses incorrecto. Debe ser 3, 6 o 12 y el interés nominal anual debe ser mayor o igual a 0.");
            } 
            } while (true); 
        }
        else //si el usuario no desea financiar, mostrar mensaje de que el precio con IVA no se financiará
        {
            Console.WriteLine("El precio con IVA no se financiará.");
            Console.WriteLine("El pago será al contado");
            Console.WriteLine("El precio total a pagar es: " + precioConIVA.ToString("F2"));
        }
    }
    else
    {
        Console.WriteLine("El pago seará al contado");
        Console.WriteLine("El precio total a pagar es: " + precioConIVA.ToString("F2"));
    }
}
}
