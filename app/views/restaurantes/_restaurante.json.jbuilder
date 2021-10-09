json.extract! restaurante, :id, :nombre, :created_at, :updated_at
json.url restaurante_url(restaurante, format: :json)
