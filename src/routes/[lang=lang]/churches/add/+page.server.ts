import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ChurchType } from '$enums'
import { generateMessages, safeFetch, actionErrorHandler, bulkFileAction, fileRemoveAction } from '$utils'
import { ApiError } from '$classes/api-error'

export const actions = {
    post: async ({ fetch, request, locals, cookies }) => {
        const i18n = locals.LL.churches.add
        const sharedI18n = locals.LL.shared
        const churchTypes = [
            { value: 'PIONEER', text: i18n.churchTypes.pioneer() },
            { value: 'EXPANSION', text: i18n.churchTypes.expansion() },
            { value: 'SUPPORT', text: i18n.churchTypes.support() },
            { value: 'RESPONSIBLE', text: i18n.churchTypes.responsible() }
        ]

        const schema = yup.object().shape({
            name: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.nameLabel() })),
            description: yup
                .string()
                .required(sharedI18n.yup.required({ field: i18n.inputs.descriptionLabel() })),
            images: yup.array(yup.string()).nullable().optional(),
            type: yup
                .string()
                .oneOf(
                    Object.values(ChurchType),
                    sharedI18n.yup.oneOf({ enums: churchTypes.map((r) => r.text).join(', ') })
                )
                .required(sharedI18n.yup.required({ field: i18n.inputs.typeLabel() })),
            field: yup.string().nullable().optional()
        })

        const data = await request.formData()
        const name = data.get('name')
        const description = data.get('description')
        const images = data.get('images')?.toString()
        const arrImages = images && images?.length > 0 ? images?.split(',') : []
        const type = data.get('type')
        const field = data.get('field')

        try {
            schema.validateSync({ name, description, images: arrImages, type, field }, { abortEarly: false })

            const res = await safeFetch(fetch, cookies, {
                url: `${PUBLIC_API_URL}/church`,
                method: 'POST',
                body: { name, description, images: arrImages, type, field }
            })
            let resJson: ApiResponseDto

            if (res && res.status !== 201) {
                throw new ApiError((await res.json()) as ApiResponseDto, res.status)
            } else {
                resJson = await res?.json()
            }

            return {
                apiData: resJson.data,
                messages: generateMessages([{ message: resJson.message, variant: 'success' }])
            }
        } catch (error) {
            return actionErrorHandler(error)
        }
    },

    bulkFile: async ({ fetch, request, cookies }) => {
        return await bulkFileAction(fetch, request, cookies)
    },

    fileRemove: async ({ fetch, request, cookies }) => {
        return await fileRemoveAction(fetch, request, cookies)
    }
} satisfies Actions
