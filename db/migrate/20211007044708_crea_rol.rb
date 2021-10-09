class CreaRol < ActiveRecord::Migration[6.1]
  def up
    create_table :roles do |t|
      t.string :nombre
      t.timestamps
    end
    execute <<-SQL
      INSERT INTO public.roles (id, nombre, created_at, updated_at) VALUES (1, 'administrador', '2021-10-07',  '2021-10-07');
      INSERT INTO public.roles (id, nombre, created_at, updated_at) VALUES (2, 'propietario', '2021-10-07',  '2021-10-07');
    SQL
  end

  def down
    drop_table :roles
  end
end

