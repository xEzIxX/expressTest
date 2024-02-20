import '../config/env.js'

import express from 'express'
import jwt from 'jsonwebtoken'
import { wrapper } from '../utils/wrapper.js'
import { BoardService } from '../services/board.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'
import { isPasswordValid } from '../utils/isPasswordValid.js'

export const boardRouter = express.Router()
const boardService = new BoardService()

boardRouter.get(
    '/', // 리스트조회
    wrapper(async (req, res) => {
        try {
            const allBoard = await boardService.foundAllBoard() // 모든 게시글 반환 서비스 함수
            // return res.send(allBoard)
            return res.render('board/list.ejs', allBoard)
        } catch (err) {
            throw err
        }
    })
)

boardRouter.get(
    // 검색
    '/search',
    wrapper(async (req, res) => {
        try {
            const queryDto = {
                q: req.query.q,
                sort: req.query.sort,
            }
            const searchedResult = await boardService.searchList(queryDto)
            // return res.send(searchedResult)
            return res.render('board/list.ejs', searchedResult)
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/form ] 게시글 작성 */

boardRouter.get(
    // 게시글 작성 페이지 조회
    '/form',
    wrapper(async (req, res) => {
        try {
            return res.render('board/form.ejs')
        } catch (err) {
            throw err
        }
    })
)

boardRouter.post(
    // 작성된 게시글 저장
    '/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            console.log('start~')
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const boardDto = {
                title: req.body.title,
                content: req.body.content,
                userid: decoded.userId,
            }

            const createdBoard = await boardService.createNewBoard(boardDto) // 작성된 글 저장 서비스 함수

            if (createdBoard.result === true) {
                return res.status(201).send(createdBoard)
            } else {
                return res.status(400).send(createdBoard)
            }
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/:boardId/edit ] 게시글 수정 */

boardRouter.get(
    // 수정 권한이 있다면 게시글 수정 페이지 조회
    '/:boardId/edit',
    wrapper(async (req, res) => {
        try {
            const boardId = req.params.boardId.split(':')[1]
            const foundOriginal =
                await boardService.getOriginalBoardById(boardId)

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            // console.log('***decoded.userId : ', decoded.userId)
            // console.log('***foundOriginal.board_user_id : ',foundOriginal.data.board_user_id)

            const isValid = decoded.userId === foundOriginal.data.board_user_id

            if (isValid) {
                // return res.status(200).send(foundOriginal)
                return res.status(200).render('board/edit.ejs', foundOriginal)
            } else {
                return res.status(401).send({ message: '권한없음' })
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.put(
    // 수정된 게시글 데이터 저장
    '/:boardId/edit',
    validate([
        body('boardId').notEmpty(),
        body('title').notEmpty(),
        body('content').notEmpty(),
    ]),
    wrapper(async (req, res) => {
        try {
            const updateResult = await boardService.updateBoardById(
                req.body.boardId,
                req.body.title,
                req.body.content
            )

            if (updateResult.result === true) {
                return res.status(201).send(updateResult)
            } else {
                return res.status(404).send(updateResult)
            }
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/:boardId ] 게시글 조회 */

boardRouter.get(
    // 게시글 아이디가 boardId인 게시글 조회
    '/:boardId',
    wrapper(async (req, res) => {
        try {
            const boardId = req.params.boardId.split(':')[1]

            const board = await boardService.getBoardById(boardId) // 게시글 아이디 boardId와 일치하는 글 갖고옴

            if (board.result === true) {
                // return res.status(200).send(board)
                return res.status(200).render('board', { boardId, data: board }) // 그 글 페이지의 데이터, 화면을 보여줘야함
            } else {
                return res.status(404).render('board', { boardId, data: board })
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.delete(
    // 게시글 아이디가 boardId인 게시글 삭제
    '/:boardId',
    validate([
        body('password').isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    ]),
    wrapper(async (req, res) => {
        try {
            const boardId = req.params.boardId.split(':')[1]
            const password = req.body.password

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const isValid = isPasswordValid(decoded.userId, password) // 작성자의 password와 일치 여부 확인

            if (isValid) {
                const deletion = await boardService.deleteBoardById(boardId)
                console.log(deletion)
                const successStatus = deletion.result ? 200 : 400
                return res.status(successStatus).send(deletion)
            }
        } catch (err) {
            throw err
        }
    })
)
