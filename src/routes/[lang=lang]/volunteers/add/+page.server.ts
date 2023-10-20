import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, fileAction, fileRemoveAction } from '$utils'
import { ApiError } from '$classes/api-error'
import { Occupation } from '$enums'

export const actions = {
    post: async ({ fetch, request, locals, cookies }) => {
        const i18n = locals.LL.volunteers.add
        const sharedI18n = locals.LL.shared
        const occupations = [
            { value: 'PRESIDENT', text: i18n.occupations.president() },
            { value: 'VICE_PRESIDENT', text: i18n.occupations.vicePresident() },
            { value: 'GENERAL_COORDINATOR', text: i18n.occupations.geralCoordinator() },
            { value: 'COORDINATOR_01', text: i18n.occupations.coordinator01() },
            { value: 'COUNSELOR_01', text: i18n.occupations.counselor01() },
            { value: 'COUNSELOR_02', text: i18n.occupations.counselor02() },
            { value: 'COUNSELOR_03', text: i18n.occupations.counselor03() },
            { value: 'WEB_MASTER', text: i18n.occupations.webMaster() },
            { value: 'TREASURER_01', text: i18n.occupations.treasurer01() },
            { value: 'TREASURER_02', text: i18n.occupations.treasurer02() },
            { value: 'ACADEMIC_INSTRUCTOR_01', text: i18n.occupations.academicInstructor01() },
            { value: 'ACADEMIC_INSTRUCTOR_02', text: i18n.occupations.academicInstructor02() },
            { value: 'EXECUTIVE_SECRETARY', text: i18n.occupations.executiveSecretary() },
            { value: 'AUXILIARY_SECRETARY', text: i18n.occupations.auxiliarySecretary() },
            { value: 'COORDINATOR_02', text: i18n.occupations.coordinator02() },
            { value: 'INFIELD_COORDINATOR', text: i18n.occupations.infieldCoordinator() },
            { value: 'OUTFIELD_COORDINATOR', text: i18n.occupations.outfieldCoordinator() },
            { value: 'COLLECTOR', text: i18n.occupations.collector() },
            { value: 'SUPPORT_SERVICE', text: i18n.occupations.supportService() }
        ]

        const schema = yup.object().shape({
            firstName: yup
                .string()
                .required(sharedI18n.yup.required({ field: i18n.inputs.firstNameLabel() })),
            lastName: yup.string().nullable().optional(),
            email: yup
                .string()
                .nullable()
                .email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
                .optional(),
            avatar: yup.string().nullable().optional(),
            joinedDate: yup
                .string()
                .required(sharedI18n.yup.required({ field: i18n.inputs.joinedDateLabel() })),
            occupation: yup
                .string()
                .oneOf(
                    Object.values(Occupation),
                    sharedI18n.yup.oneOf({ enums: occupations.map((r) => r.text).join(', ') })
                )
                .required(sharedI18n.yup.required({ field: i18n.inputs.occupationLabel() })),
            church: yup.string().nullable().optional(),
            priest: yup.string().nullable().optional(),
            observation: yup.string().nullable().optional(),
            field: yup.string().nullable().optional()
        })

        const data = await request.formData()
        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const email = data.get('email')
        const avatar = data.get('avatar')
        const joinedDate = data.get('joinedDate')
        const occupation = data.get('occupation')
        const church = data.get('church')
        const priest = data.get('priest')
        const observation = data.get('observation')
        const field = data.get('field')

        try {
            schema.validateSync({ firstName, lastName, email, avatar: avatar || undefined, joinedDate, field, occupation, church, priest, observation }, { abortEarly: false })

            const res = await safeFetch(fetch, cookies, {
                url: `${PUBLIC_API_URL}/volunteer`,
                method: 'POST',
                body: { firstName, lastName, email: email || undefined, avatar, joinedDate, occupation, church, priest, observation, field }
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

    file: async ({ fetch, request, cookies }) => {
        return await fileAction(fetch, request, cookies)
    },

    fileRemove: async ({ fetch, request, cookies }) => {
        return await fileRemoveAction(fetch, request, cookies)
    }
} satisfies Actions
