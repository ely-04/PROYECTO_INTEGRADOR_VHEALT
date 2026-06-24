@echo off
echo ================================
echo  CONFIGURACION V-HEALTH MYSQL
echo ================================
echo.

echo 🔧 Instalando dependencias del monorepo...
call npm install

echo.
echo Ejecutando script de creacion de BD (base vhealth opcional)...
node back\scripts\setup_mysql_database.cjs

echo.
echo ✅ Proceso completado!
echo.
echo 📝 SIGUIENTES PASOS:
echo 1. Abre XAMPP Control Panel
echo 2. Inicia el servicio MySQL
echo 3. Ve a phpMyAdmin: http://localhost/phpmyadmin
echo 4. Verifica que la BD 'vhealth' este creada
echo.
echo 🔑 CREDENCIALES DE PRUEBA:
echo Admin: admin@vhealth.com / Admin123!
echo Usuario: user@vhealth.com / User123!
echo.
pause