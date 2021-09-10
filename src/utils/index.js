const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  inserted_at,
  updated_at
}) => ({
  id,
  title,
  body,
  tags,
  insertedAt: inserted_at,
  updatedAt: updated_at
})

module.exports = { mapDBToModel }
